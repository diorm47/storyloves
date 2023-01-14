import React, { Component, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./home-page.css";
import logo from "../assets/logo.png";

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
      url: `https://api.storyloves.net/suggest/city?query=${props}&ccode=ES`,
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

function HomePage() {
  const [locationError, setLocationError] = useState(false);
  const [seconFieldActive, setSeconFieldActive] = useState(false);
  const [emailError, setEmailError] = useState(0);
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [userAge, setUserAge] = useState();
  const [userName, setUserName] = useState();
  const [cityId, setCityId] = useState();

  const ref = useRef("");

  const getcityId = async () => {
    let city = ref.current.state.userInput.split(",")[2].trim();
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: `https://api.storyloves.net/suggest/city?query=${city}&ccode=ES`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    setCityId(response.data.suggestions[0]._id);
  };

  const firstField = (data) => {
    getcityId();
    if (ref.current.state.userInput) {
      setLocationError(false);
      setSeconFieldActive(true);
    } else {
      setLocationError(true);
    }
    setUserAge(data.age);
    setUserName(data.name);
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

  const onSubmit = async (data) => {
    let formdata = new FormData();
    formdata.append("ccode", "us");
    formdata.append("city", `${ref.current.state.userInput}`);
    formdata.append("age", `${userAge}`);
    formdata.append("city_id", `${cityId}`);
    formdata.append("email", `${data.email}`);
    formdata.append("name", `${userName}`);
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

    if (emailError !== 1) {
      await axios.request(reqOptions).then((res) => {
        window.location.assign(
          `https://storyloves.net/land-login?activkey=${res.data.key}&email=${res.data.login}`
        );
      });
    }
  };
  return (
    <>
      <header>
        <div className="header_wrapper">
          <div className="home_content">
            <div className="home_left_part">
              <div className="left_default_text">
                <img src={logo} alt="logo" />
                <h1>La forma segura de encontrar el amor</h1>
                <p>PERFILES COMPROBADOS Y SIN PRESIONES</p>
              </div>
              <div className="changing_fields">
                <div
                  className={
                    !seconFieldActive ? "field_1" : "field_1 block_field_1"
                  }
                >
                  <p>Tu información</p>
                  <form onSubmit={handleSubmit(firstField)}>
                    <div className="your_age">
                      <select
                        name="age"
                        {...register("age", { required: true })}
                      >
                        <option value="">Su edad</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="36">36</option>
                        <option value="37">37</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="44">44</option>
                        <option value="45">45</option>
                        <option value="46">46</option>
                        <option value="47">47</option>
                        <option value="48">48</option>
                        <option value="49">49</option>
                        <option value="50">50</option>
                        <option value="51">51</option>
                        <option value="52">52</option>
                        <option value="53">53</option>
                        <option value="54">54</option>
                        <option value="55">55</option>
                        <option value="56">56</option>
                        <option value="57">57</option>
                        <option value="58">58</option>
                        <option value="59">59</option>
                        <option value="60">60</option>
                        <option value="61">61</option>
                        <option value="62">62</option>
                        <option value="63">63</option>
                        <option value="64">64</option>
                        <option value="65">65</option>
                        <option value="66">66</option>
                        <option value="67">67</option>
                        <option value="68">68</option>
                        <option value="69">69</option>
                        <option value="70">70</option>
                        <option value="71">71</option>
                        <option value="72">72</option>
                        <option value="73">73</option>
                        <option value="74">74</option>
                        <option value="75">75</option>
                        <option value="76">76</option>
                        <option value="77">77</option>
                        <option value="78">78</option>
                      </select>
                      {errors.age && <span>* Se requiere edad</span>}
                    </div>
                    <div className="your_name">
                      <input
                        type="text"
                        placeholder="tu nombre"
                        pattern="^([A-Za-z]+[,.]?[ ]?|[A-Za-z]+['-]?)+$"
                        {...register("name", { required: true })}
                      />
                      {errors.name && (
                        <span>* Se requiere nombre de usuario</span>
                      )}
                    </div>
                    <div className="your_city">
                      <Autocomplete getcityId={getcityId} ref={ref} />
                      {locationError ? (
                        <span>* Se requiere ubicación</span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="submit_btn">
                      <button>Próximo</button>
                    </div>
                  </form>
                </div>
                <div
                  className={
                    seconFieldActive ? "field_2" : "field_2 block_field_1"
                  }
                >
                  <p>Your info</p>
                  <form onSubmit={handleSubmit2(onSubmit)}>
                    <div className="email_sign">
                      <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        {...register2("email", { required: true })}
                        onChange={(e) => checkEmail(e)}
                      />
                      {errors2.email && (
                        <span>* Correo electronico es requerido</span>
                      )}
                      {emailError === 1 ? (
                        <span>
                          El correo electrónico ya existe o no es válido
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="password_sign">
                      <input
                        placeholder="Contraseña"
                        type="password"
                        {...register2("password", {
                          required: true,
                          minLength: 6,
                        })}
                      />
                      {errors2.password && (
                        <span>* Se requiere contraseña mínimo 6 símbolos</span>
                      )}
                    </div>

                    <div className="submit_btn_2_field">
                      <button>Únete ahora</button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="footer_text">
                <p>
                  DERECHOS DE AUTOR STORYLOVES.NET 2023. <br /> TODOS LOS
                  DERECHOS RESERVADOS
                </p>
              </div>
            </div>
            <div className="home_right_dams">
              {!seconFieldActive ? (
                <div className="img_1">
                  <div className="back_wrapper"></div>
                </div>
              ) : (
                // <img src={require("../assets/member-1.png")} alt="member 1" />
                <div className="img_2">
                  <div className="back_wrapper"></div>
                </div>

                // <img src={require("../assets/member-2.png")} alt="member 2" />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default HomePage;
