import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const humanizeDuration = require("humanize-duration");

function Timestamp({Timestamp: value}) {
    const then = new Date(value);
    const now = new Date();
    return (
        <strong>
            {humanizeDuration(Math.abs(now - then), {largest: 1})} ago
        </strong>
    );
}

function ResultEntry({entries}) {
    const resultList = entries.filter(
        result => result["Useful Information"] || result["Safety Observations"]
    );
    return resultList.map(result => (
        <div className="mt-3" key={result["Timestamp"]}>
            <div className="d-inline-block">
                {result["Safety Observations"] ? (
                    <div className="d-inline-block">
                        <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-top">
                                    Safety instructions and tips
                                </Tooltip>
                            }
                        >
                            <div>
                                <i className="far fa-shield-virus mr-1"></i>
                                {result["Safety Observations"]}
                            </div>
                        </OverlayTrigger>
                    </div>
                ) : null}
                {result["Useful Information"] ? (
                    <div className="d-block mt-1">
                        <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-top">
                                    Useful information from the visit
                                </Tooltip>
                            }
                        >
                            <div>
                                <i className="far fa-info-circle mr-1"></i>
                                {result["Useful Information"]}
                            </div>
                        </OverlayTrigger>
                    </div>
                ) : null}
            </div>
            <div style={{fontSize: "0.85em"}}>
                <small className="text-muted text-uppercase d-inline-block mt-1">
                    {" "}
                    Updated <Timestamp {...result} />
                </small>
            </div>
        </div>
    ));
}

export default ResultEntry;
