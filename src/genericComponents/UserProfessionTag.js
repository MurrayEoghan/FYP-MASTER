import React, { useState, useEffect } from "react";

import { Label } from "semantic-ui-react";

function UserProfessionTag(props) {
  let { professionId, size, style } = props;
  let [professionValue, setProfessionValue] = useState("");

  let colors = [
    "red",
    "orange",
    "yellow",
    "olive",
    "green",
    "teal",
    "blue",
    "violet",
    "purple",
    "pink",
    "brown",
    "grey",
    "black",
  ];

  useEffect(() => {
    switch (professionId) {
      case 1:
        setProfessionValue("General Practioner");
        break;
      case 2:
        setProfessionValue("Pharmacist");
        break;
      case 3:
        setProfessionValue("Physiotherapist");
        break;
      case 4:
        setProfessionValue("Nutritionist");
        break;
      case 5:
        setProfessionValue("Dietitian");
        break;
      case 6:
        setProfessionValue("Surgeon");
        break;
      case 7:
        setProfessionValue("Dentist");
        break;
      case 8:
        setProfessionValue("Respiratory Therapist");
        break;
      case 9:
        setProfessionValue("Cardiologist");
        break;
      case 10:
        setProfessionValue("Psychiatrist");
        break;
      case 11:
        setProfessionValue("Optometrist");
        break;
      case 12:
        setProfessionValue("Chiropractor");
        break;
      case 13:
        setProfessionValue("Optician");
        break;
      default:
        break;
    }
  }, [professionId]);

  return (
    <>
      {professionId === 0 ? null : (
        <Label
          color={colors[professionId]}
          key={professionId}
          style={style}
          size={size}
        >
          {professionValue}
        </Label>
      )}
    </>
  );
}

export default UserProfessionTag;
