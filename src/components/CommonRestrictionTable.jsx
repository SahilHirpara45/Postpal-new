import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

function CommonRestrictionTable({ customIqs, itemId, selectedRows }) {
  console.log(selectedRows, "customIqs in CommonRestrictionTable");
  const data = [
    {
      category: "General Compliance",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Dangerous Goods",
          id: "dangerousGoods",
          system: {
            disabled: true,
            checked: customIqs?.dangerousGoods?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.dangerousGoods?.humanValidation,
          },
        },
        {
          category: "Restricted",
          id: "restricted",
          system: {
            disabled: true,
            checked: customIqs?.restricted?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.restricted?.humanValidation,
          },
        },
        {
          category: "Prohibited",
          id: "prohibited",
          system: {
            disabled: true,
            checked: customIqs?.prohibited?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.prohibited?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Licensing and Documentation",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Licence is required",
          id: "licenseRequired",
          system: {
            disabled: true,
            checked: customIqs?.licenseRequired?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.licenseRequired?.humanValidation,
          },
        },
        {
          category: "Prescription is required",
          id: "prescriptionRequired",
          system: {
            disabled: true,
            checked: customIqs?.prescriptionRequired?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.prescriptionRequired?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Legal Concerns",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Counterfeit or replica",
          id: "counterfeitOrReplica",
          system: {
            disabled: true,
            checked: customIqs?.counterfeitOrReplica?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.counterfeitOrReplica?.humanValidation,
          },
        },
        {
          category: "Bullion of any kind",
          id: "bullionOfAnyKind",
          system: {
            disabled: true,
            checked: customIqs?.bullionOfAnyKind?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.bullionOfAnyKind?.humanValidation,
          },
        },
        {
          category: "Illicit drug",
          id: "illicitDrug",
          system: {
            disabled: true,
            checked: customIqs?.illicitDrug?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.illicitDrug?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Safety and Security",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Explosives",
          id: "explosives",
          system: {
            disabled: true,
            checked: customIqs?.explosives?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.explosives?.humanValidation,
          },
        },
        {
          category: "Gun and gun accessories",
          id: "gunAndGunAccessories",
          system: {
            disabled: true,
            checked: customIqs?.gunAndGunAccessories?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.gunAndGunAccessories?.humanValidation,
          },
        },
      ],
    },
  ];
  const data2 = [
    {
      category: "organic and Perishable items",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Animal or Animal extract",
          id: "animalOrAnimalExtract",
          system: {
            disabled: true,
            checked: customIqs?.animalOrAnimalExtract?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.animalOrAnimalExtract?.humanValidation,
          },
        },
        {
          category: "Perishable food",
          id: "perishableFood",
          system: {
            disabled: true,
            checked: customIqs?.perishableFood?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.perishableFood?.humanValidation,
          },
        },
        {
          category: "Seeds or live plants",
          id: "seedsOrLivePlants",
          system: {
            disabled: true,
            checked: customIqs?.seedsOrLivePlants?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.seedsOrLivePlants?.humanValidation,
          },
        },
        {
          category: "Frozen",
          id: "frozen",
          system: {
            disabled: true,
            checked: customIqs?.frozen?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.frozen?.humanValidation,
          },
        },
        {
          category: "If Fresh",
          id: "ifFresh",
          system: {
            disabled: true,
            checked: customIqs?.ifFresh?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.ifFresh?.humanValidation,
          },
        },
        {
          category: "Processed food",
          id: "processedFood",
          system: {
            disabled: true,
            checked: customIqs?.processedFood?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.processedFood?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Cultural and Sensitive Items",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Religious items or objects",
          id: "religiousItemsOrObjects",
          system: {
            disabled: true,
            checked: customIqs?.religiousItemsOrObjects?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.religiousItemsOrObjects?.humanValidation,
          },
        },
        {
          category: "Non-muslim Religious item",
          id: "nonMuslimReligiousItem",
          system: {
            disabled: true,
            checked: customIqs?.nonMuslimReligiousItem?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.nonMuslimReligiousItem?.humanValidation,
          },
        },
        {
          category: "Pornography",
          id: "pornography",
          system: {
            disabled: true,
            checked: customIqs?.pornography?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.pornography?.humanValidation,
          },
        },
        {
          category: "Sex Toys or objects",
          id: "sexToysOrObjects",
          system: {
            disabled: true,
            checked: customIqs?.sexToysOrObjects?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.sexToysOrObjects?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Special Categories",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Endangered species",
          id: "endangeredSpecies",
          system: {
            disabled: true,
            checked: customIqs?.endangeredSpecies?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.endangeredSpecies?.humanValidation,
          },
        },
        {
          category: "High Fashion",
          id: "highFashion",
          system: {
            disabled: true,
            checked: customIqs?.highFashion?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.highFashion?.humanValidation,
          },
        },
        {
          category: "Supplements",
          id: "supplements",
          system: {
            disabled: true,
            checked: customIqs?.supplements?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.supplements?.humanValidation,
          },
        },
      ],
    },
  ];
  const data3 = [
    {
      category: "Substance Controls",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Tobacco products",
          id: "tobaccoProducts",
          system: {
            disabled: true,
            checked: customIqs?.tobaccoProducts?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.tobaccoProducts?.humanValidation,
          },
        },
        {
          category: "CBD or THC",
          id: "cbdOrThc",
          system: {
            disabled: true,
            checked: customIqs?.cbdOrThc?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.cbdOrThc?.humanValidation,
          },
        },
        {
          category: "Vaping device",
          id: "vippingDevice",
          system: {
            disabled: true,
            checked: customIqs?.vippingDevice?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.vippingDevice?.humanValidation,
          },
        },
        {
          category: "Hookah or water pipes",
          id: "hookahOrWaterPipes",
          system: {
            disabled: true,
            checked: customIqs?.hookahOrWaterPipes?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.hookahOrWaterPipes?.humanValidation,
          },
        },
      ],
    },
  ];

  const data4 = [
    {
      category: "Battery Safety",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Standalone batteries",
          id: "standaloneBatteries",
          system: {
            disabled: true,
            checked: customIqs?.standaloneBatteries?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.standaloneBatteries?.humanValidation,
          },
        },
        {
          category: "Lithium-ion battery",
          id: "lithiumIonBattery",
          system: {
            disabled: true,
            checked: customIqs?.lithiumIonBattery?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.lithiumIonBattery?.humanValidation,
          },
        },
        {
          category: "Additional battery",
          id: "additionalBattery",
          system: {
            disabled: true,
            checked: customIqs?.additionalBattery?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.additionalBattery?.humanValidation,
          },
        },
        {
          category: "External battery",
          id: "externalBattery",
          system: {
            disabled: true,
            checked: customIqs?.externalBattery?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.externalBattery?.humanValidation,
          },
        },
      ],
    },
    {
      category: "Flammable and Hazardous Materials",
      system: { disabled: false },
      human: { disabled: false },
      child: [
        {
          category: "Flammable",
          id: "flammable",
          system: {
            disabled: true,
            checked: customIqs?.flammable?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.flammable?.humanValidation,
          },
        },
        {
          category: "Alcohol",
          id: "alcohol",
          system: {
            disabled: true,
            checked: customIqs?.alcohol?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.alcohol?.humanValidation,
          },
        },
        {
          category: "Perfume and colognes",
          id: "perfumeAndColognes",
          system: {
            disabled: true,
            checked: customIqs?.perfumeAndColognes?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.perfumeAndColognes?.humanValidation,
          },
        },
        {
          category: "Engine parts",
          id: "engineParts",
          system: {
            disabled: true,
            checked: customIqs?.engineParts?.customIqResponse,
          },
          human: {
            disabled: false,
            checked: customIqs?.engineParts?.humanValidation,
          },
        },
      ],
    },
  ];

  const [restrictions, setRestrictions] = React.useState(data || []);
  const [restrictions2, setRestrictions2] = React.useState(data2 || []);
  const [restrictions3, setRestrictions3] = React.useState(data3 || []);
  const [restrictions4, setRestrictions4] = React.useState(data4 || []);

  return (
    <>
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Regular and legal Restriction
        </label>
      </Box>
      {restrictions.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    name={childCategory.category}
                    control={
                      <Switch
                        checked={childCategory.human.checked}
                        onChange={(e) => {
                          const updatedData = [...restrictions];
                          updatedData[parentIndex].child[
                            childIndex
                          ].human.checked = e.target.checked;
                          setRestrictions(updatedData);
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box
        className="mt-2"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const updatedCustomIqs = {};
            restrictions?.map((restriction) => {
              restriction?.child?.map((child) => {
                updatedCustomIqs[child.id] = {
                  customIqResponse: child.system.checked,
                  humanValidation: child.human.checked,
                };
              });
            });
            console.log(
              itemId,
              { ...customIqs, ...updatedCustomIqs },
              "updatedCustomIqs"
            );
            const updated = { ...customIqs, ...updatedCustomIqs };
            const docRef = doc(db, "items", itemId);
            updateDoc(docRef, {
              customiqRestrictions: updated,
            }).then((res) => {
              console.log(res,"resp in update doc");
              toast.success("Custom Iq restrictions updated successfully");
            });
          }}
        >
          Submit
        </Button>
      </Box>
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Nature of Goods
        </label>
      </Box>
      {restrictions2.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch
                        checked={childCategory.human.checked}
                        onChange={(e) => {
                          const updatedData = [...restrictions2];
                          updatedData[parentIndex].child[
                            childIndex
                          ].human.checked = e.target.checked;
                          console.log(updatedData, "updateData data");
                          setRestrictions2(updatedData);
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box
        className="mt-2"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const updatedCustomIqs = {};
            restrictions2?.map((restriction) => {
              restriction?.child?.map((child) => {
                updatedCustomIqs[child.id] = {
                  customIqResponse: child.system.checked,
                  humanValidation: child.human.checked,
                };
              });
            });
            const updated = { ...customIqs, ...updatedCustomIqs };
            console.log(updated, updatedCustomIqs, "updated jhi");
            const docRef = doc(db, "items", itemId);
            await updateDoc(docRef, {
              customiqRestrictions: updated,
            });
          }}
        >
          Submit
        </Button>
      </Box>
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Specific product Regulations
        </label>
      </Box>
      {restrictions3.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch
                        checked={childCategory.human.checked}
                        onChange={(e) => {
                          const updatedData = [...restrictions3];
                          updatedData[parentIndex].child[
                            childIndex
                          ].human.checked = e.target.checked;
                          console.log(updatedData, "updateData data");
                          setRestrictions3(updatedData);
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box
        className="mt-2"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const updatedCustomIqs = {};
            restrictions3?.map((restriction) => {
              restriction?.child?.map((child) => {
                updatedCustomIqs[child.id] = {
                  customIqResponse: child.system.checked,
                  humanValidation: child.human.checked,
                };
              });
            });
            const updated = { ...customIqs, ...updatedCustomIqs };
            console.log(updated, updatedCustomIqs, "updated jhi");
            const docRef = doc(db, "items", itemId);
            await updateDoc(docRef, {
              customiqRestrictions: updated,
            });
          }}
        >
          Submit
        </Button>
      </Box>
      <Box sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Bettary and Chemical Regulation
        </label>
      </Box>
      {restrictions4.map((parentCategory, parentIndex) => (
        <React.Fragment key={parentIndex}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F9FAFC",
              height: "38px",
              border: "1px solid #E5E5E8",
              paddingX: "20px",
              paddingY: "10px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                {parentCategory.category}
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                System
              </label>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "25%",
              }}
            >
              <label
                style={{
                  fontSize: "14px",
                }}
              >
                Human
              </label>
            </Box>
          </Box>
          {parentCategory.child.map((childCategory, childIndex) => (
            <Box
              key={childIndex}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                height: "44px",
                border: "1px solid #E5E5E8",
                borderTop: "none",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {childCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.system.disabled}
                    control={
                      <Switch defaultChecked={childCategory.system.checked} />
                    }
                  />
                </FormGroup>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    disabled={childCategory.human.disabled}
                    control={
                      <Switch
                        checked={childCategory.human.checked}
                        onChange={(e) => {
                          const updatedData = [...restrictions4];
                          updatedData[parentIndex].child[
                            childIndex
                          ].human.checked = e.target.checked;
                          // console.log(updatedData, "updateData data");
                          setRestrictions4(updatedData);
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Box>
          ))}
        </React.Fragment>
      ))}
      <Box
        className="mt-2"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const updatedCustomIqs = {};
            restrictions4?.map((restriction) => {
              restriction?.child?.map((child) => {
                updatedCustomIqs[child.id] = {
                  customIqResponse: child.system.checked,
                  humanValidation: child.human.checked,
                };
              });
            });
            const updated = { ...customIqs, ...updatedCustomIqs };
            console.log(updated, updatedCustomIqs, "updated jhi");
            const docRef = doc(db, "items", itemId);
            await updateDoc(docRef, {
              customiqRestrictions: updated,
            });
          }}
        >
          Submit
        </Button>
      </Box>
      {/* <Box sx={{ marginTop: "10px" }}>
        {data5.map((parentCategory, parentIndex) => (
          <React.Fragment key={parentIndex}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F9FAFC",
                height: "38px",
                border: "1px solid #E5E5E8",
                paddingX: "20px",
                paddingY: "10px",
              }}
            >
              <Box sx={{ width: "50%" }}>
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {parentCategory.category}
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  System
                </label>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "25%",
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Human
                </label>
              </Box>
            </Box>
            {parentCategory.child.map((childCategory, childIndex) => (
              <Box
                key={childIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  height: "44px",
                  border: "1px solid #E5E5E8",
                  borderTop: "none",
                  paddingX: "20px",
                  paddingY: "10px",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <label
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    {childCategory.category}
                  </label>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "25%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      disabled={childCategory.system.disabled}
                      control={
                        <Switch defaultChecked={childCategory.system.checked} />
                      }
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "25%",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      disabled={childCategory.human.disabled}
                      control={
                        <Switch defaultChecked={childCategory.human.checked} />
                      }
                    />
                  </FormGroup>
                </Box>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </Box> */}
    </>
  );
}

export default CommonRestrictionTable;
