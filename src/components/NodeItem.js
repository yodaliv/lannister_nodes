import React from 'react';

const NodeItem = ({ node_name, rewards }) => {
  return (
    <div className="node-item">
      <span>{node_name}</span>
      <span>{rewards}</span>
    </div>
  );
}

export default NodeItem;