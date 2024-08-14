import React, { useEffect, useState } from "react";
import { Box, Button, Rating, TextareaAutosize } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

const initialValue = {
  rating: 0,
  review: "",
};

const validationSchema = Yup.object({
  rating: Yup.number()
    .required("Rating is required")
    .min(0.5, "Minimum rating is 0.5")
    .max(5, "Maximum rating is 5"),
  review: Yup.string()
    .required("Review is required")
    .min(10, "Review must be at least 10 characters long"),
});
function CustomerReview({ packageActiveData, packageCollectionName }) {
  const [initialValues, setInitialValues] = useState(initialValue);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const getForId = async () => {
      if (packageActiveData?.id) {
        const docRef = doc(db, "shelfPackages", packageActiveData?.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInitialValues(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };
    getForId();
  }, [packageActiveData?.id]);

  // console.log(orderData, "=order");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form values:", values);
      if (packageActiveData?.id) {
        const docRef = doc(db, "order", packageActiveData?.id);
        console.log(packageActiveData?.id, "packageActiveData?.id");

        if (packageActiveData) {
          console.log("In if");
          // console.log(packageActiveData, "packageActiveData>>>");

          const ratingReviewArray = packageActiveData.ratingReview || [];

          // const userIndex = ratingReviewArray.findIndex(
          //   (user) => user.name === ""
          // );

          // console.log(userIndex, "userIndex>>>");

          // if (userIndex !== -1) {
          //   console.log("in if userindex");
          //   const updatedRatingReview = [...ratingReviewArray];
          //   updatedRatingReview[userIndex] = {
          //     name: "Current User",
          //     rating: rating,
          //     totalReview: 1,
          //     review: comment,
          //   };

          //   await updateDoc(docRef, {
          //     ratingReview: updatedRatingReview,
          //   });
          // } else {
          //   console.log("In Else");

          await updateDoc(docRef, {
            ratingReview: [
              ...ratingReviewArray,
              {
                name: "Current User",
                rating: rating,
                totalReview: 1,
                review: comment,
              },
            ],
          }).then(() => {
            toast.success("Rating and review submitted successfully");
          });
          // }
          const updatedDocSnap = await getDoc(docRef);
          setInitialValues(updatedDocSnap.data());
        }
      }

      setRating(0);
      setComment("");
    },
  });

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
        marginLeft: "20px",
        display: "inline-grid",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Rating
            name="rating"
            value={formik.values.rating}
            onChange={(event, newValue) => {
              formik.setFieldValue("rating", newValue);
            }}
            size="large"
            precision={0.5}
          />
          {formik.touched.rating && formik.errors.rating && (
            <div style={{ color: "red" }}>{formik.errors.rating}</div>
          )}
        </Box>
        <Box>
          <TextareaAutosize
            name="review"
            value={formik.values.review}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-label="textarea"
            placeholder="Type your review..."
            minRows={4}
            style={{
              width: "500px",
              border: "1px solid  #E5E5E8",
              padding: "10px",
              marginTop: "10px",
              "&:focus": {
                outline: "none",
                borderColor: "transparent", // Remove border color on focus
              },
            }}
          />
          {formik.touched.review && formik.errors.review && (
            <div style={{ color: "red" }}>{formik.errors.review}</div>
          )}
        </Box>
        <Button
          variant="contained"
          sx={{ width: "200px", marginTop: "20px", borderRadius: "4px" }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default CustomerReview;
