import { Grid } from "@mui/material";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { green, yellow } from "@mui/material/colors";

interface Props {
  color?: string;
  record: { key: string; value: string }[];
  icon?: "Closed" | "Open";
}

const BlueCard: React.FC<Props> = (props) => {
  return (
    <Grid
      style={{
        backgroundColor: "#1976d2",
        margin: ".5rem",
        padding: "5px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span>
          {props.record.map((e) => {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "white" }}>
                  <b>{e.key}</b>: {e.value}
                </span>
              </div>
            );
          })}
        </span>
        {props.icon && (
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              paddingRight: "5px",
              paddingTop: "2px",
            }}
          >
            {props.icon === "Closed" && (
              <CheckCircleOutlineIcon sx={{ color: green[400] }} />
            )}
            {props.icon === "Open" && <ErrorIcon sx={{ color: yellow[700] }} />}
          </span>
        )}
      </div>
    </Grid>
  );
};

export default BlueCard;
