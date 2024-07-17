import React, { useState } from 'react';


function App() {
  const initialSchemaItems = [
    { label: 'First Name', value: '', visible: true },
    { label: 'Last Name', value: '', visible: false },
    { label: 'Gender', value: '', visible: false },
    { label: 'Age', value: '', visible: false },
    { label: 'Account Name', value: '', visible: false },
    { label: 'City', value: '', visible: false },
    { label: 'State', value: '', visible: false },
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemaIndex, setSelectedSchemaIndex] = useState(0);
  const [schemaItems, setSchemaItems] = useState(initialSchemaItems);

  const handleSaveSegment = () => {
    setShowPopup(true);
    
  };

  const handleCancel = () => {
    setShowPopup(false);
    setSegmentName('');
    setSelectedSchemaIndex(0);
    setSchemaItems(initialSchemaItems);
  };

  const handleAddSchema = () => {
    setSelectedSchemaIndex(prevIndex => prevIndex + 1);
    const updatedSchemaItems = [...schemaItems];
    updatedSchemaItems[selectedSchemaIndex + 1].visible = true;
    setSchemaItems(updatedSchemaItems);
  };

  const handleInputChange = (index, value) => {
    const updatedSchemaItems = [...schemaItems];
    updatedSchemaItems[index].value = value;
    setSchemaItems(updatedSchemaItems);
  };

  const handleRemoveSchema = (index) => {
    const updatedSchemaItems = [...schemaItems];
    updatedSchemaItems[index].visible = false;
    setSchemaItems(updatedSchemaItems);
  };

  const handleResetSchema = () => {
    setSelectedSchemaIndex(0);
    setSchemaItems(initialSchemaItems);
  };

  const handleSubmit = () => {
    const data = {
      segment_name: segmentName,
      schema: schemaItems.reduce((acc, schema) => {
        if (schema.visible) {
          acc[schema.label.toLowerCase().replace(' ', '_')] = schema.value;
        }
        return acc;
      }, {}),
    };

    fetch('https://webhook.site/YOUR_UNIQUE_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(response => {
      if (response.ok) {
        alert('Segment saved successfully!');
        setShowPopup(false);
        setSegmentName('');
        setSelectedSchemaIndex(0);
        setSchemaItems(initialSchemaItems);
      }
    });
  };

  return (
    <div className="App">
      
      <div className={`left-side ${showPopup ? 'blur' : ''}`}>
        <h2>Save Segment</h2>
        <button className="save-button" onClick={handleSaveSegment}>Save segment</button>
      </div>
      {showPopup && (
        <div className="right-side">
          <div className="popup">
            <h2>Save Segment</h2>
            <input
              type="text"
              placeholder="Segment Name"
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
            />
            <div className="input-container">
              {schemaItems.slice(0, selectedSchemaIndex + 1).map((schema, index) => (
                schema.visible &&
                <div key={index} className="schema-item">
                  <label>{schema.label}:</label>
                  <input
                    type="text"
                    value={schema.value}
                    onChange={e => handleInputChange(index, e.target.value)}
                  />
                  <button className="remove-button" onClick={() => handleRemoveSchema(index)}>-</button>
                </div>
              ))}
            </div>
            <div className="button-container">
              <button className="add-schema-button" onClick={handleAddSchema}>+ Add Schema</button>
              <span className="add-new-schema-link" onClick={handleResetSchema}>+ Add New Schema</span>
            </div>
            <div className="footer-buttons">
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button className="submit-button" onClick={handleSubmit}>Save the segment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;