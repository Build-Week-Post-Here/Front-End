import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  getSavedPosts,
  EDIT_DRAFT,
  EDIT_SAVED_POST,
  editPost
} from "../actions";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import styled from "styled-components";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const CardWrapper = styled.div`
  background-color: white;
  padding: 10px;
  min-width: 90vh;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 3%;
  color: black;
  font-weight: 300;
`;

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const SearchWrapper = styled.div`
  width: 271px;
  height: 100%;
  min-height: 100vh;
  left: 885px;
  top: 65px;
  background: linear-gradient(
    180deg,
    #333355 49.92%,
    rgba(51, 51, 85, 0.85) 100%
  );
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

// const SearchWrapper = styled.div`
// 	align-text: right;
// 	margin-left: 50%;
// `;

const SavedPosts = props => {
  const { getSavedPosts, editPost, id, savedPosts } = props;
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    console.log("getting first saved posts");
    getSavedPosts(id);
  }, []);

  useEffect(() => {
    console.log(
      "checking if saved posts is valid, and new filtered results",
      savedPosts
    );
    if (!savedPosts) {
      console.log(savedPosts);
      setFilteredResults(savedPosts);
    } else {
      setFilteredResults([]);
    }
  }, [savedPosts]);

  useEffect(() => {
    console.log("search query");
    //need logic to differentiate between object and array
    if (savedPosts && typeof savedPosts !== "object") {
      console.log(typeof savedPosts);
      setFilteredResults(
        savedPosts.filter(({ title, content }) => {
          console.log("made it to the filter");
          return (
            title.toLowerCase().includes(query.toLowerCase()) ||
            content.toLowerCase().includes(query.toLowerCase())
          );
        })
      );
    } else {
      setFilteredResults([]);
    }
  }, [query]);

  const handleInputChange = e => {
    setQuery(e.target.value);
  };

  if (!filteredResults) {
    return <div className="saved-post-container">You have no saved posts</div>;
  } else {
    return (
      <ResultsWrapper>
        <form>
          <label htmlFor="name"></label>
          <SearchWrapper>
            <TextField
              id="outlined-search"
              onChange={handleInputChange}
              label="Search field"
              type="search"
              name="search"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              style={{
                position: "sticky",
                width: "222px",
                height: "37px",
                left: "910px",
                top: "92px",
                background: "white",
                marginLeft: "25px",
                marginRight: "25px",
                borderRadius: "10px"
              }}
            />
          </SearchWrapper>
        </form>
        <div>
          {filteredResults.map(filteredResult => {
            const { title, content } = filteredResult;
            return (
              <CardWrapper style={{ backgroundColor: "#E5F0F8" }}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Link
                      style={{ textDecoration: "none" }}
                      onClick={() => {
                        //update state that this is the post we are editing
                        editPost(filteredResult);
                      }}
                      to={"/Singlepostview"}
                      key={title}
                    >
                      <Typography
                        style={{ color: "#333355", fontWeight: 700 }}
                        className={(classes.heading, "cardTitle")}
                      >
                        {title}
                      </Typography>{" "}
                    </Link>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography style={{ fontWeight: 300 }}>
                      {content}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                {/* <h1 style={{ color: "#333355" }}>{title}</h1>
                  <h3 style={{ fontWeight: 300 }}>{post}</h3> */}
              </CardWrapper>
            );
          })}
        </div>
      </ResultsWrapper>
    );
  }
};

const mapStateToProps = state => {
  return {
    id: state.loggedInUser,
    savedPosts: state.savedPosts.data
  };
};

export default connect(
  mapStateToProps,
  { getSavedPosts, editPost }
)(SavedPosts);
