function addRecommendation() {

  // Get the message of the new recommendation
  let recommendation = document.getElementById("new_recommendation");

  // If the user has left a recommendation, display a pop-up
  if (recommendation.value != null &&
      recommendation.value.trim() != "") {

    console.log("New recommendation added");

    // Call showPopup here
    showPopup(true);

    // Create a new recommendation element
    var element = document.createElement("div");

    element.setAttribute("class", "recommendation");

    element.innerHTML =
      "<span>&#8220;</span>" +
      recommendation.value +
      "<span>&#8221;</span>";

    // Add the new recommendation to the list
    document
      .getElementById("all_recommendations")
      .appendChild(element);

    // Reset textarea value
    recommendation.value = "";
  }
}


function showPopup(bool) {

  if (bool) {

    document.getElementById('popup').style.visibility = 'visible';

  } else {

    document.getElementById('popup').style.visibility = 'hidden';

  }

}