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
      countryCode: "US",
    };
  }
  getCountry = async () => {
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: "https://ipwho.is/",
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);

    this.setState({
      countryCode: response.data.country_code,
    });
    this.props.setCcode(response.data.country_code);
  };
  componentDidMount() {
    this.getCountry();
  }

  getData = [];
  setSuggestions = async (props) => {
    let headersList = {
      Accept: "*/*",
    };
    let reqOptions = {
      url: `https://api.storyloves.net/suggest/city?ccode=${this.state.countryCode}&query=${props}`,
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
          placeholder="Localización"
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
  const [ccode, setCcode] = useState("");

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
      url: `https://api.storyloves.net/suggest/city?ccode=${ccode}&query=${city}`,
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

    let params = new URL(document.location).searchParams;

    let formdata = new FormData();
    formdata.append("ccode", `${ccode}`);
    formdata.append("city", `${ref.current.state.userInput}`);
    formdata.append("age", `${userAge}`);
    formdata.append("city_id", `${cityId}`);
    formdata.append("email", `${data.email}`);
    formdata.append("name", `${data.name}`);
    formdata.append("password", `${data.password}`);
    if (params.get("source")) {
      formdata.append("source", `${params.get("source")}`);
      formdata.append("l", `${params.get("I")}`);
      formdata.append("platform", `${params.get("platform")}`);
      formdata.append("extwb", `${params.get("extwb")}`);
      formdata.append("adult", `${params.get("adult")}`);
      formdata.append("ukey", `${params.get("ukey")}`);
      formdata.append("subacc", `${params.get("subacc")}`);
      formdata.append("subid", `${params.get("subid")}`);
      formdata.append("app", `${params.get("app")}`);
      formdata.append("gaid", `${params.get("gaid")}`);
    }
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
          <h1>Regístrate para empezar a conocer gente!</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="name_input">
            <input
              type="text"
              placeholder="Nombre de usuario"
              pattern="^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$"
              {...register("name", { required: true })}
            />
            {errors.name && <span>* Se requiere nombre de usuario</span>}
          </div>

          <div className="location_input">
            <Autocomplete getcityId={getcityId} ref={ref} setCcode={setCcode}  />

            {locationError ? <span>* Se requiere ubicación</span> : ""}
          </div>

          <div className="email_sign">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              {...register("email", { required: true })}
              onChange={(e) => checkEmail(e)}
            />
            {errors.email && <span>* Correo electronico es requerido</span>}
            {emailError === 1 ? (
              <span>El correo electrónico ya existe o no es válido</span>
            ) : (
              ""
            )}
          </div>
          <div className="password_sign">
            <input
              placeholder="Contraseña"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span>* Se requiere contraseña mínimo 6 símbolos</span>
            )}
          </div>

          <div className="signin_button">
            {emailError === 1 ? (
              <input
                type="submit"
                disabled
                placeholder="Chatea ahora"
                value="Chatea ahora"
              />
            ) : (
              <input
                type="submit"
                placeholder="Chatea ahora"
                value="Chatea ahora"
                onClick={getcityId}
              />
            )}
          </div>
        </form>

        <div className="agreement_policy">
          <p>
            Al hacer clic en "Chatea ahora", aceptas las
            <span> Términos y condiciones</span> y{" "}
            <span>Política de privacidad </span>y{" "}
            <span>Política de reembolso y cancelación</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Modal;
