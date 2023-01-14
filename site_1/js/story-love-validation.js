var slv = function (t) {
  var e,
    s = $("[name=city_id]"),
    i = $("[name=city]"),
    a = "https://api.storyloves.net",
    r = {
      types: {
        empty: "",
        email: "",
        emailExists: "",
        password: "",
        noresult: "",
      },
      show: function (e, s) {
        $(e)
          .addClass("error-field")
          .find(t.errorContainerSelector)
          .text(s)
          .addClass("error");
      },
      loadHints: function () {
        var e = this.types,
          s = "",
          i = t.hintsFrom;
        for (var a in e)
          "" !== (s = i.filter("[data-" + a + "]").text()) && (e[a] = s);
      },
    },
    n = {
      options: { fieldsWrapper: t.fieldsWrapper },
      state: { step: 0, activkey: "", ccode: t.data.ccode },
      valid: function (e) {
        this.state.step++,
          this.state.step < this.options.fieldsWrapper.length
            ? ($(e).removeClass("error-field").addClass("valid-field"),
              t.afterValidation(this.state.step))
            : this.finaly();
      },
      check: function () {
        var t = this.options.fieldsWrapper.eq(this.state.step),
          e = t.find("input, select"),
          i = e.attr("name"),
          a = e.val();
        switch ((e.length || this.valid(t), (this.state[i] = a), i)) {
          case "password":
            if (!a.length || !a) return r.show(t, r.types.empty), !1;
            if (a.length < 6) return r.show(t, r.types.passsword), !1;
            this.valid(t);
            break;
          case "city":
            if (!s.val().length || !s.val())
              return r.show(t, r.types.empty), !1;
            this.valid(t), (this.state[s.attr("name")] = s.val());
            break;
          case "email":
            if (!a.length || !a) return r.show(t, r.types.empty), !1;
            if (
              !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i.test(
                a
              )
            )
              return r.show(t, r.types.email), !1;
            this.checkEmail(a, t);
            break;
          default:
            if (!a || !a.length) return r.show(t, r.types.empty), !1;
            this.valid(t);
        }
      },
      checkEmail: function (t, e) {
        $.ajax({
          method: "GET",
          url: a + "/registration/check/login/" + t,
          success: function (t) {
            t.error ? r.show(e, r.types.emailExists) : n.valid(e);
          },
          error: function (t) {
            return t.error && r.show(e, r.types.emailExists), !1;
          },
        });
      },
      checkCity: function (t, s, i) {
        e = $.ajax({
          method: "GET",
          url: a + "/suggest/city?ccode=" + this.state.ccode + "&query=" + t,
          beforeSend: function (t) {
            t.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          },
          success: function (e) {
            return s(t, e, i), !0;
          },
          error: function (t) {
            return !1;
          },
        });
      },
      showresults: function (e, s, i) {
        var a = s.suggestions,
          n = $(i),
          o = n.find(".results-list");
        if (
          (n.removeClass("e-loading e-noresult"),
          n
            .removeClass("error-field")
            .find(t.errorContainerSelector)
            .removeClass("error")
            .html(""),
          o.addClass("show").html(""),
          !a.length || !e.length)
        )
          return (
            n.addClass("e-noresult"),
            r.show(n, r.types.noresult),
            void o.removeClass("show")
          );
        a.forEach(function (t) {
          o.append(
            $(
              '<li data-city-id="' +
                t._id +
                '">' +
                t.country +
                ", " +
                t.administratives[0].name +
                ", " +
                t.name +
                "</li>"
            )
          );
        });
      },
      setCityId: function (t) {
        s.val(t.id || 0),
          i.val(t.string || ""),
          $(".results-list").removeClass("show");
      },
      finaly: function () {
        var e = {
            city_id: this.state.city_id,
            city: this.state.city,
            name: this.state.name,
            age: this.state.age,
            email: this.state.email,
            password: this.state.password,
            l: window.land_id,
          },
          s = [e, t.data].reduce(function (t, e) {
            return (
              Object.keys(e).forEach(function (s) {
                t[s] = e[s];
              }),
              t
            );
          }, {});
        $.ajax({
          method: "POST",
          url: a + "/land-reg",
          data: s,
          success: function (i) {
            i.success && (e.key = i.key),
              t.whenDone({ data: s, login: i.login, key: e.key });
          },
          error: function (t) {
            return !1;
          },
        });
      },
      goToStep: function (e) {
        e > this.state.step ||
          ((this.state.step = e),
          this.options.fieldsWrapper.eq(e).removeClass("valid-field"),
          t.onGoTo(e));
      },
    };
  return {
    init: function () {
      r.loadHints.call(r),
        $("body").on("click", function (t) {
          var e = $(t.target).closest("[data-city-id]");
          0 !== e.length &&
            n.setCityId({ id: e.attr("data-city-id"), string: e.text() });
        }),
        i.on("keyup", function (s) {
          var i = $(s.target).val();
          void 0 !== e && e.abort(),
            n.checkCity(i, n.showresults, $(this).closest(t.fieldsWrapper));
        });
    },
    check: function () {
      n.check.call(n);
    },
    goTo: function (t) {
      n.goToStep(t);
    },
  };
};
