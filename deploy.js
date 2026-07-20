import { NodeSSH } from 'node-ssh';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ssh = new NodeSSH();

async function deploy() {
  try {
    console.log('Connecting to server...');
    await ssh.connect({
      host: '148.230.98.197',
      username: 'root',
      password: 'Bismillah212'
    });
    console.log('Connected!');

    const remoteDir = '/var/www/undangan';

    console.log(`Creating directory ${remoteDir}...`);
    await ssh.execCommand(`mkdir -p ${remoteDir}`);

    console.log('Uploading files...');
    // We will upload src, public, package.json, vite.config.ts, tsconfig.json, server.ts, etc.
    const failed = [];
    const successful = [];
    
    await ssh.putDirectory(__dirname, remoteDir, {
      recursive: true,
      concurrency: 10,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath);
        return !baseName.startsWith('.git') && 
               !itemPath.includes('node_modules') && 
               !itemPath.includes('dist');
      },
      tick: function(localPath, remotePath, error) {
        if (error) {
          failed.push(localPath);
        } else {
          successful.push(localPath);
        }
      }
    });
    
    console.log(`Upload complete. ${successful.length} successful, ${failed.length} failed.`);
    if (failed.length > 0) {
      console.log('Failed:', failed);
    }

    console.log('Installing dependencies on server...');
    const npmInstall = await ssh.execCommand('npm install', { cwd: remoteDir });
    console.log('npm install output:', npmInstall.stdout);
    if (npmInstall.stderr) console.error('npm install errors:', npmInstall.stderr);

    console.log('Building the project...');
    const npmBuild = await ssh.execCommand('npm run build', { cwd: remoteDir });
    console.log('npm build output:', npmBuild.stdout);
    if (npmBuild.stderr) console.error('npm build errors:', npmBuild.stderr);

    console.log('Configuring PM2...');
    // check if PM2 process exists
    const pm2Check = await ssh.execCommand('pm2 list | grep undangan');
    if (pm2Check.stdout.includes('undangan')) {
      console.log('Restarting PM2 process...');
      await ssh.execCommand('pm2 restart undangan', { cwd: remoteDir });
    } else {
      console.log('Starting new PM2 process...');
      await ssh.execCommand('pm2 start npm --name "undangan" -- run start', { cwd: remoteDir });
    }

    console.log('Saving PM2 state...');
    await ssh.execCommand('pm2 save');

    console.log('Deployment successful!');
    
  } catch (error) {
    console.error('Deployment failed:', error);
  } finally {
    ssh.dispose();
  }
}

deploy();
