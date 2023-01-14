import React, { Component, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./modal.css";

import PropTypes from "prop-types";
import axios from "axios";

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
    };
  }

  getData = [];
  setSuggestions = async (props) => {
    let headersList = {
      Accept: "*/*",
    };
    let reqOptions = {
      url: `https://api.storyloves.net/suggest/city?query=${props}`,
      method: "GET",
      headers: headersList,
    };
    let response = await axios.request(reqOptions);
    this.getData = response.data.suggestions.map(
      (arr) => `${arr.country}, ${arr.administratives[0].name}, ${arr.name}`
    );
  };

  onChange = (e) => {
    const userInput = e.currentTarget.value;
    this.setSuggestions(userInput);
    const filteredSuggestions = this.getData;

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return (
      <>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
          placeholder="Location"
        />
        {suggestionsListComponent}
      </>
    );
  }
}

function Modal({ userAge }) {
  const [cityId, setCityId] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [emailError, setEmailError] = useState(0);

  const ref = useRef("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // GetCityId

  const getcityId = async () => {
    let city = ref.current.state.userInput.split(",")[2].trim();
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: `https://api.storyloves.net/suggest/city?query=${city}`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    setCityId(response.data.suggestions[0]._id);
  };

  const checkEmail = async (e) => {
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: `https://api.storyloves.net/registration/check/login/${e.target.value}`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    if (response.data.error) {
      setEmailError(1);
    } else {
      setEmailError(2);
    }
  };

  // submit
  const onSubmit = async (data) => {
    if (ref.current.state.userInput) {
      setLocationError(false);
    } else {
      setLocationError(true);
    }

    let formdata = new FormData();
    formdata.append("ccode", "us");
    formdata.append("city", `${ref.current.state.userInput}`);
    formdata.append("age", `${userAge}`);
    formdata.append("city_id", `${cityId}`);
    formdata.append("email", `${data.email}`);
    formdata.append("name", `${data.name}`);
    formdata.append("password", `${data.password}`);

    let bodyContent = formdata;
    let headersList = {
      Accept: "*/*",
      "X-Requested-With": "XMLHttpRequest",
    };

    let reqOptions = {
      url: "https://api.storyloves.net/land-reg",
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };

    await axios.request(reqOptions).then((res) => {
      window.location.assign(
        `https://storyloves.net/land-login?activkey=${res.data.key}&email=${res.data.login}`
      );
    });
  };

  return (
    <div className="modal_wrapper">
      <div className="modal_block">
        <div className="modal_title">
          <h1>Sign up to start meeting people!</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="name_input">
            <input
              type="text"
              placeholder="Username"
              pattern="^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$"
              {...register("name", { required: true })}
            />
            {errors.name && <span>* Username is required</span>}
          </div>

          <div className="location_input">
            <Autocomplete getcityId={getcityId} ref={ref} />

            {locationError ? <span>* Location is required</span> : ""}
          </div>

          <div className="email_sign">
            <input
              type="email"
              placeholder="Your Email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              {...register("email", { required: true })}
              onChange={(e) => checkEmail(e)}
            />
            {errors.email && <span>* Email is required</span>}
            {emailError === 1 ? (
              <span> Email is already exist or invalid</span>
            ) : (
              ""
            )}
          </div>
          <div className="password_sign">
            <input
              placeholder="Password"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span>* Password is required minimum 6 symbols</span>
            )}
          </div>

          <div className="signin_button">
            {emailError === 1 ? (
              <input
                type="submit"
                disabled
                placeholder="Chat Now"
                value="Chat Now"
              />
            ) : (
              <input
                type="submit"
                placeholder="Chat Now"
                value="Chat Now"
                onClick={getcityId}
              />
            )}
          </div>
        </form>

        <div className="agreement_policy">
          <p>
            By clicking "Chat Now" you agree with the
            <span> Terms & Conditions</span> and <span>Privacy Policy </span>
            and <span>Refund and Cancellation Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;