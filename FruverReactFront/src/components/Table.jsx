import React from "react";

const Table = ({ headers, rows, pagination }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th>{header.name}</th>
            ))}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default Table;
