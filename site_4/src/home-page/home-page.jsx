import React, { useState } from "react";
import "./home-page.css";
import logo from "../assets/logo.png";
import Modal from "../components/modal/modal";

import { ReactComponent as MaleSvg } from "../assets/male.svg";
import { ReactComponent as FamaleSvg } from "../assets/famale.svg";

function HomePage() {
  const [activeMale, setActiveMale] = useState(false);
  const [activeFaMale, setActiveFamale] = useState(false);
  const [sheekingActiveMale, setSheekingActiveMale] = useState(false);
  const [sheekingActiveFaMale, setSheekingActiveFamale] = useState(false);
  const [myGender, setMyGender] = useState();
  const [seekingGender, setSeekingGender] = useState();
  const [myGenderError, setMyGenderError] = useState(false);
  const [seekingGenderError, setSeekingGenderError] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [userAge, setUserAge] = useState(18);

  const toggleMyGender = (gender) => {
    if (gender === "male") {
      setActiveMale(true);
      setActiveFamale(false);
      setMyGender("male");
    } else {
      setActiveMale(false);
      setActiveFamale(true);
      setMyGender("famale");
    }
  };
  const toggleSeekingGender = (gender) => {
    if (gender === "male") {
      setSheekingActiveMale(true);
      setSheekingActiveFamale(false);
      setSeekingGender("male");
    } else {
      setSheekingActiveMale(false);
      setSheekingActiveFamale(true);
      setSeekingGender("famale");
    }
  };

  const setModal = () => {
    if (!myGender || !seekingGender) {
      setMyGenderError(true);
      setSeekingGenderError(true);
    } else {
      setModal1(true);
      setMyGenderError(false);
      setSeekingGenderError(false);
    }
  };
  const handleChange = (e) => {
    setUserAge(e.target.value);
  };

  return (
    <>
      <div className="mobile_logo">
        <img src={logo} alt="logo" />
      </div>
      <header>
        <div className="mobile_background"></div>
        <div className="home_page">
          <div className="regisration_form">
            <div className="form_logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="form_title">
              <h1>Encuentra tu amor</h1>
              <p>Conectando solteros con su pareja ideal</p>
            </div>
            <div className="genders_toggles">
              <div className="my_gender_iden">
                <div className="my_genderis">
                  <p>Soy un:</p>
                  <div className="my_gender">
                    <MaleSvg
                      className={activeMale ? "male_active_svg" : ""}
                      onClick={() => toggleMyGender("male")}
                    />
                    <FamaleSvg
                      className={activeFaMale ? "famale_active_svg" : ""}
                      onClick={() => toggleMyGender("famale")}
                    />
                  </div>
                </div>
                <div className="error_gender">
                  {myGenderError ? <p>Selecciona tu género</p> : ""}
                </div>
              </div>
              <div className="seeking_gender_iden">
                <div className="sheeking_genderis">
                  <p>Buscando un:</p>
                  <div className="my_gender">
                    <MaleSvg
                      className={sheekingActiveMale ? "male_active_svg" : ""}
                      onClick={() => toggleSeekingGender("male")}
                    />
                    <FamaleSvg
                      className={
                        sheekingActiveFaMale ? "famale_active_svg" : ""
                      }
                      onClick={() => toggleSeekingGender("famale")}
                    />
                  </div>
                </div>
                <div className="error_gender">
                  {seekingGenderError ? <p>Selecciona tu género</p> : ""}
                </div>
              </div>
            </div>
            <div className="between_ages">
              <p>Entre edades:</p>
              <select name="age" onChange={handleChange}>
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

              <p>
                <span>y</span>
              </p>
              <select name="age">
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
            </div>
            <div className="take_chance" onClick={setModal}>
              <button type="submit">Arriesgarse</button>
            </div>
            <div className="agreement_policy">
              <p>
                Al hacer clic en "Arriesgarse", aceptas las
                <span> Términos y condiciones</span> y{" "}
                <span>Política de privacidad </span>y{" "}
                <span>Política de reembolso y cancelación</span>.
              </p>
            </div>
          </div>
        </div>
      </header>
      {modal1 ? <Modal userAge={userAge} /> : ""}
    </>
  );
}

export default HomePage;
