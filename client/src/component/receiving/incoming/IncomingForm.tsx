import "./styles.css";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { ipCon } from "../..";

const IncomingForm = () => {
  const [title, setTitle] = useState<string>("");
  const [trackingNumber, settrackingNumber] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [letterType, setLetterType] = useState<"Incoming" | "Outgoing">(
    "Incoming"
  );
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("trackingNumber", trackingNumber);
    formData.append("from", from);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("letterType", letterType);

    for (const file of files) {
      formData.append("attachments", file);
    }

    const saveData = async (formData: FormData) => {
      try {
        const response = await axios.post(`${ipCon}/save-data`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    try {
      await saveData(formData);
      console.log("Form data submitted successfully");
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  return (
    <div className="main">
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Tracking Number:
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => settrackingNumber(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          from:
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          to:
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Letter Type:
          <select
            value={letterType}
            onChange={(e) =>
              setLetterType(e.target.value as "Incoming" | "Outgoing")
            }
          >
            <option value="Incoming">Incoming</option>
            <option value="Outgoing">Outgoing</option>
          </select>
        </label>
      </div>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <ul>
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default IncomingForm;
