import sys

def modify_analytics(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add imports
    old_imports = "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';"
    new_imports = "import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';"
    content = content.replace(old_imports, new_imports)

    # Replace charts area
    old_charts = """          {/* Charts */}
          <div className="col-span-12 bg-white p-6 rounded-2xl border border-gray-200 h-[400px] flex flex-col">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Attendance By Event</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="registered" name="Registered" fill="#312E81" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attended" name="Attended" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>"""
    
    new_charts = """          {/* Charts */}
          <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 h-[400px] flex flex-col">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Attendance By Event</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="registered" name="Registered" fill="#312E81" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attended" name="Attended" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 h-[400px] flex flex-col">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-6">Overall Attendance</h3>
            <div className="flex-1 min-h-0 flex items-center justify-center relative">
              {data.totalRegistered === 0 ? (
                <p className="text-sm text-gray-500">No data available</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Attended', value: data.totalAttended, color: '#4F46E5' },
                          { name: 'Not Attended', value: data.totalRegistered - data.totalAttended, color: '#E5E7EB' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          [
                            { name: 'Attended', value: data.totalAttended, color: '#4F46E5' },
                            { name: 'Not Attended', value: data.totalRegistered - data.totalAttended, color: '#E5E7EB' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 12px' }}
                        itemStyle={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-3xl font-serif text-gray-900 leading-none">{data.attendanceRate.toFixed(0)}%</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Rate</span>
                  </div>
                </>
              )}
            </div>
          </div>"""
    
    content = content.replace(old_charts, new_charts)

    with open(filepath, "w") as f:
        f.write(content)

modify_analytics("src/components/AnalyticsDashboard.tsx")
