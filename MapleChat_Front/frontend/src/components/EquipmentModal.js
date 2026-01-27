import React from 'react';
import { slotGrid } from '../constants/equipmentSlots';
import { getRarityColor } from '../utils/gameLogic';

const EquipmentModal = ({ isOpen, onClose, equipmentInfo, activeTooltip, setActiveTooltip }) => {
  if (!isOpen || !equipmentInfo?.item_equipment?.length) return null;

  return (
    <div className="modal-overlay" onClick={() => {
      if (activeTooltip.pinned) {
        setActiveTooltip({ equipment: null, pinned: false, position: null });
      } else {
        onClose();
      }
    }}>
      <div className="modal-content equipment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="equipment-list">
          <h3>장비 목록</h3>
          <div className="equipment-grid">
            {slotGrid.map((slot, index) => {
              const equip = equipmentInfo.item_equipment.find(item => item.item_equipment_slot === slot.slot);
              const rarityColor = equip ? getRarityColor(equip.potential_option_grade) : null;
              return (
                <div 
                  key={index} 
                  className={`equipment-item ${!equip ? 'empty' : ''}`}
                  style={rarityColor ? { '--hover-color': rarityColor } : {}}
                  onMouseEnter={(e) => {
                    if (equip && !activeTooltip.pinned) {
                        setActiveTooltip({
                          equipment: equip,
                          pinned: false,
                          position: { x: e.clientX + 15, y: e.clientY + 15 }
                        });
                    }
                  }}
                  onMouseMove={(e) => {
                    if (equip && !activeTooltip.pinned) {
                        setActiveTooltip(prev => ({
                          ...prev,
                          position: { x: e.clientX + 15, y: e.clientY + 15 }
                        }));
                    }
                  }}
                  onMouseLeave={() => {
                    if (!activeTooltip.pinned) {
                      setActiveTooltip({ equipment: null, pinned: false, position: null });
                    }
                  }}
                  onClick={(e) => {
                    if (equip) {
                      if (activeTooltip.pinned && activeTooltip.equipment === equip) {
                        setActiveTooltip({ equipment: null, pinned: false, position: null });
                      } else {
                        setActiveTooltip({
                          equipment: equip,
                          pinned: true,
                          position: { x: e.clientX + 15, y: e.clientY + 15 }
                        });
                      }
                    }
                  }}
                >
                  {equip ? (
                    <>
                      {equip.item_icon && (
                        <img src={equip.item_icon} alt={equip.item_name} />
                      )}
                      <div className="equipment-name">{equip.item_name}</div>
                    </>
                  ) : (
                    <span className="slot-label">{slot.label}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentModal;