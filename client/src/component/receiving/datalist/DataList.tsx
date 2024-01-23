import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

import { ipCon } from "../../../secret/ipCon";

type DataItem = {
  trackingNumber: string;
  title: string;
  letterType: string;
  from: string;
  to: string;
  subject: string;
  attachments: File[];
};
const DataList = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${ipCon}/get-data`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item?.trackingNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.letterType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const viewDetails = (item: DataItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const deleteLetter = () => {
    console.log("deleteLetter");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const downloadAttachment = async () => {
    alert("This button is currently useless po ^.^");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <p className="letter-name">Letter Counter: </p>
      <input
        type="text"
        placeholder="Search by tracking number, title, or letter type"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Letter Type</th>
            <th>HUDO</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.trackingNumber || index}>
              <td>{item.trackingNumber}</td>
              <td>{item.title}</td>
              <td>{item.subject}</td>
              <td>{item.letterType}</td>
              <td style={{ display: "flex" }}>
                <button onClick={() => viewDetails(item)}>Details</button>
                <button
                  style={{ marginLeft: "10px", background: "red" }}
                  onClick={deleteLetter}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalVisible && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedItem.title}</h2>
            <div className="detail-section">
              <p>
                <strong>Tracking Number:</strong> {selectedItem.trackingNumber}
              </p>
              <p>
                <strong>From:</strong> {selectedItem.from}
              </p>
              <p>
                <strong>To:</strong> {selectedItem.to}
              </p>
              <p>
                <strong>Letter Type:</strong> {selectedItem.letterType}
              </p>
            </div>
            <div className="button-section">
              <button onClick={downloadAttachment}>Download Attachment</button>{" "}
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataList;
