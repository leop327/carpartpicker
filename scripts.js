// Function to fetch car makes from CarQuery API
function getCarMakes() {
  // CarQuery API endpoint URL for makes
  var apiURL = "https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes"; 
  // Fetch data from the API
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        var makeDropdown = document.getElementById("make");
        data.Makes.forEach(make => {
          var option = document.createElement("option");
          option.value = make.make_display;
          option.text = make.make_display;
          makeDropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
}
// Execute function to fetch car makes 
getCarMakes();
