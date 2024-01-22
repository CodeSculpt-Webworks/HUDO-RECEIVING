import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

import { ipCon } from "../..";

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
        item?.letterType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const viewDetails = (item: DataItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const downloadAttachment = async (title: string, filename: string) => {
    try {
      const response = await axios.get(`/download-data/${title}/${filename}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading attachment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
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
            <th>Letter Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.trackingNumber || index}>
              <td>{item.trackingNumber}</td>
              <td>{item.title}</td>
              <td>{item.letterType}</td>
              <td>
                <button onClick={() => viewDetails(item)}>View Details</button>
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
            <h2>Details</h2>
            <p>
              Title - Tracking Number: {selectedItem.title} -{" "}
              {selectedItem.trackingNumber}
            </p>
            <p>
              From - To: {selectedItem.from} - {selectedItem.to}
            </p>
            <p>Subject: {selectedItem.subject}</p>
            <p>Letter Type: {selectedItem.letterType}</p>
            <button onClick={downloadAttachment}>
              Download Attachment
            </button>{" "}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataList;
