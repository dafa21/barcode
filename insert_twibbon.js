      {isTwibbonConfigOpen && selectedEvent && (
        <TwibbonConfigurator
          event={selectedEvent}
          onClose={() => setIsTwibbonConfigOpen(false)}
          onSave={handleSaveTwibbonConfig}
        />
      )}
