import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./modal.css";

import axios from "axios";
import Autocomplete from "../../autocomplete/autocomplete";
import NeedntCityId from "../../need-city-id/need-city-id";

function Modal({ userAge }) {
  const [cityId, setCityId] = useState("");
  const [city, setCity] = useState();
  const [needCityId, setKnow] = useState(true);
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
  const getCountry = async () => {
    let headersList = {
      Accept: "*/*",
    };

    let reqOptions = {
      url: "https://ipwho.is/",
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);

    setCcode(response.data.country_code);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const needCity = async () => {
    let headersList = {
      Accept: "*/*",
    };
    let reqOptions = {
      url: `https://api.storyloves.net/need_city_id?country=${ccode}`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    setKnow(response.data);
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
    if (needCityId) {
      if (ref.current.state.userInput) {
        setLocationError(false);
      } else {
        setLocationError(true);
      }
    }

    let params = new URL(document.location).searchParams;

    let formdata = new FormData();
    formdata.append("ccode", `${ccode}`);
    formdata.append("age", `${userAge}`);
    if (needCityId) {
      formdata.append("city_id", `${cityId}`);
      formdata.append("city", `${ref.current.state.userInput}`);
    } else {
      formdata.append("city", `${city}`);
    }

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

  useEffect(() => {
    getCountry();
    needCity();
  }, [needCity]);
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
            {needCityId ? (
              <>
                <Autocomplete
                  getcityId={getcityId}
                  ref={ref}
                  setCcode={setCcode}
                  setKnow={setKnow}
                />

                {locationError ? <span>* Se requiere ubicación</span> : ""}
              </>
            ) : (
              <>
                <NeedntCityId setCity={setCity} setCcode={setCcode} />

                {locationError ? <span>* Se requiere ubicación</span> : ""}
              </>
            )}
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
