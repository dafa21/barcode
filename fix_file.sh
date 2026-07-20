cat << 'INNER_EOF' >> src/components/OfficeAdminDashboard.tsx
                <div className="mt-8 flex flex-col items-center relative z-10 w-full">
                  {isGeneratingTwibbon ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Generating ID Card...</p>
                    </div>
                  ) : generatedTwibbon ? (
                    <div className="w-full max-w-[320px] mx-auto">
                      <img src={generatedTwibbon} alt="Guest ID Card" className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200" />
                      <div className="mt-6 flex gap-3 w-full">
                        <a
                          href={generatedTwibbon}
                          download={`${generatedBarcode.name.replace(/\s+/g, "_")}_ID_Card.png`}
                          className="flex-1 flex justify-center items-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 border border-indigo-200 hover:bg-indigo-50 bg-indigo-50/50 shadow-sm rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button 
                          onClick={() => {
                            setGeneratedBarcode(null);
                            setIsRegisterModalOpen(false);
                          }}
                          className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 bg-white shadow-sm rounded-lg transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
INNER_EOF
