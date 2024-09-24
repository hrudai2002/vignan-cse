import axios from "axios";
import { useEffect, useState } from "react";
import { environments } from '../environment';
import { MdCloudDownload } from "react-icons/md";
import moment from "moment";
import { saveAs } from 'file-saver';
import './App.css'

export function App() {
  const [contestName, setContestName] = useState<string>('');
  const [contestsData, setContestsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${environments.apiUrl}/leetcode-downloads/contests`);
    setContestsData(res.data);
    setFilteredData(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if(!contestName.length) {
      setFilteredData(contestsData);
      return;
    }
    setFilteredData(contestsData.filter((doc: any) => doc.name.toLowerCase().includes(contestName.toLowerCase())));
  }, [contestName])

  const downloadExcel = async (contest: any) => {
    const res = await axios.get(`${environments.apiUrl}/leetcode-downloads/contest/${contest._id}`, { responseType: 'blob' }); 
    saveAs(res.data, `${contest.name}.xlsx`);
  }


  return (
    <div className="main-container">
      <form className="max-w-lg mx-auto">
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" value={contestName} onChange={(e) => setContestName(e.target.value)} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Contests" required />
        </div>
      </form>

      <div className="max-w-lg mx-auto contests">
        <div className="row-field">
          <div className="contest-flex">Contests</div>
          <div className="downloads-flex">Downloads</div>
        </div>
        {
          filteredData.map((doc: any, index) => (
            <div className="row-field" key={index}>
              <div className="contest-flex">
                <div>{doc.name}</div>
                <div style={{ fontSize: "14px", color: 'grey' }}>{ moment(doc.date).format('DD MMM') }</div>
              </div>
              <div className="downloads-flex download-btn" onClick={() => downloadExcel(doc)}><MdCloudDownload color="black" fontSize={28} /></div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App

