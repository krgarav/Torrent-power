

// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select"
import { fetchProcessData } from "helper/JobQueue_helper";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { scanFiles } from "helper/JobQueue_helper";
import { refreshScanner } from "helper/JobQueue_helper";

const JobQueue = () => {
    const [count, setCount] = useState(true)
    const [data, setData] = useState([]);

    const getScanData = async () => {
        try {
            const data = await fetchProcessData();

            if (data?.result?.success) {
                console.log(data?.result?.data);
                setData(data?.result?.data);
            }
        } catch (error) {
            // Handle error if needed
        } finally {
            // Schedule next call after 10 seconds
            setTimeout(getScanData, 1000);
        }
    };

    useEffect(() => {
        // Start the first call
        getScanData();

        // Clean-up function to stop any ongoing setTimeout when the component unmounts
        return () => clearTimeout();
    }, []);


    const handleStart = () => {
        try {
            scanFiles();
        } catch (error) {
            console.log(error);
            toast.error("Error in starting");
        }
    }

    const handleRefresh = () => {
        try {
            refreshScanner();
        } catch (error) {
            console.log(error)
            toast.error("Error in Refresh")
        }
    }

    return (
        <>
            <NormalHeader />
            <div className=" head">
                <div className="table-main">
                    <table className=" ">
                        <thead>
                            <tr className="JobQueueTableTr">
                                <th className="JobQueueTableTh">Region</th>
                                <th className="JobQueueTableTh">District</th>
                                <th>School</th>
                                <th>Candidate</th>
                                {[...Array(40).keys()].map(i => (
                                    <th key={i}>Q{i + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => (
                                <tr className="JobQueueTableTr" key={index}>
                                    {Object.values(item).map((value, i) => (
                                        <td key={i}>{value}</td>
                                    ))}
                                </tr>
                            ))}

                            {[...Array(20).keys()].map(i => (
                                <tr className="JobQueueTableTr" key={i}>
                                    {[...Array(44).keys()].map(i => (
                                        <td key={i}>  </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="functions mt-2 d-flex justify-content-end">
                    <Button className="" color="success" type="button" onClick={handleStart}>
                        Start
                    </Button>
                    <Button className="" color="warning" type="button" onClick={handleRefresh}>
                        Refresh
                    </Button>
                </div>
            </div>
        </>
    );
};

export default JobQueue;


