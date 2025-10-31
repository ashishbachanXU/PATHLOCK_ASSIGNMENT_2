interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedOrder: string[];
  message: string;
}

export default function ScheduleModal({ isOpen, onClose, recommendedOrder, message }: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Smart Schedule Results</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="schedule-message">{message}</p>
          
          {recommendedOrder && recommendedOrder.length > 0 && (
            <div className="schedule-list">
              <h3>Recommended Task Order:</h3>
              <ol className="task-order-list">
                {recommendedOrder.map((task, index) => (
                  <li key={index} className="task-order-item">
                    <span className="task-number">{index + 1}</span>
                    <span className="task-name">{task}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
