const { div, h5, h6, hr } = van.tags;

const Popover = () => {
  const barangayStats = {
    barangay_name: "139",
    registered_voters: 4578,
    winning_party_color: "#377EB8",
    turnout: {
      trillanes: 3562,
      malapitan: 1873,
      independents: 589,
      abstained: 236
    }
  };
  return div(
    { class: "popover" },
    div(
      h5({class: "popupH6"},"Barangay " + barangayStats.barangay_name),
      p({class: "popupSubtext"}, "Registered voters: " + barangayStats.registered_voters),
      hr({class: "popupline"}),
      h6("Turnout:"),
      div(
        tbody(
          tr( {class: "aksyon"},
            td({class: "turnoutRow"}, "Trillanes"),
            barangayStats.turnout.trillanes
          ),
          tr( {class: "nacionalista"},
            td({class: "turnoutRow"}, "Malapitan"),
            barangayStats.turnout.malapitan
          ),
          tr(
            td({class: "turnoutRow"}, "Independents"),
            barangayStats.turnout.independents
          ),
          tr(
            td({class: "turnoutRow"}, "Abstained"),
            barangayStats.turnout.abstained
          ),
        )
      )
    )
  );
};

// tbody(
//   [{ barangay_name: "139", registered_voters: 4556, party_color: "123" }].map(
//     (c) => tr(
//       {
//         style: `/*--background: ${shade(
//           c.party_color,
//           0.731
//         )};--width: 25%;*/--winnerPartyColor: ${c.party_color};`,
//       },
//       //td({ title: c.total_votes }, c.full_name),
//       //td(c.total_votes)
//       th({title: "Barangay" + c.barangay_name}, "Barangay " + c.barangay_name),
//     )
//   )
// )


document.getElementById("caloocan-map").addEventListener("load", function () {
  svgPanZoom("#caloocan-map", {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    // viewportSelector: document.getElementById('demo-tiger').querySelector('#g4')
    // this option will make library to misbehave. Viewport should have no transform attribute
  });
});

const colorMap = van.state([
  {
    psgc: "1380100139",
    color: "#377EB8",
  },
]);
van.add(document.getElementById("barangayStats"), Popover());

const popover = document.querySelectorAll(".popover")[0];

document.addEventListener("mousemove", fn, false);
document.addEventListener("mouseout", function (event) {
  if (event.target.classList.contains("map-brgys")) {
    popover.style.display = "none";
  }
});
document.addEventListener("mouseenter", function (event) {
  if (event.target.classList.contains("map-brgys")) {
    popover.style.display = "block";
  }
});

function fn(e) {
  if (e.target.classList.contains("map-brgys")) {
    popover.style.display = "block";
    popover.style.left = e.pageX + "px";
    popover.style.top = e.pageY + "px";
  }
}
