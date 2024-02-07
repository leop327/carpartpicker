const make = document.getElementById("make");
const model = document.getElementById("model");
const year = document.getElementById("year");
const findParts = document.getElementById("find-parts");
const partsList = document.getElementById("parts-list");

// Sample data (remove this in a real-world application)
// const makes = [
//   { id: 1, name: "Toyota" },
//   { id: 2, name: "Honda" },
//   { id: 3, name: "Mercedes" },
// ];

// Make an HTTP request to the car API to get the car makes
fetch("https://api.car-data.com/makes")
  .then((response) => response.json())
  .then((data) => {
    // Populate the make dropdown using the car make data from the API
    data.forEach((make) => {
      const option = document.createElement("option");
      option.value = make.id;
      option.textContent = make.name;
      make.appendChild(option);
    });

    // When the make dropdown changes, make another HTTP request to the API to get the car models
    make.addEventListener("change", () => {
      model.innerHTML = "";
      const selectedMake = data.find((make) => make.id === parseInt(make.value));
      fetch(`https://api.car-data.com/models?make_id=${selectedMake.id}`)
        .then((response) => response.json())
        .then((data) => {
          data.forEach((model) => {
            const option = document.createElement("option");
            option.value = model.id;
            option.textContent = model.name;
            model.appendChild(option);
          });

          // When the model dropdown changes, make another HTTP request to the API to get the car years
          model.addEventListener("change", () => {
            year.innerHTML = "";
            const selectedModel = data.find((model) => model.id === parseInt(model.value));
            fetch(`https://api.car-data.com/years?model_id=${selectedModel.id}`)
              .then((response) => response.json())
              .then((data) => {
                data.forEach((year) => {
                  const option = document.createElement("option");
                  option.value = year;
                  option.textContent = year;
                  year.appendChild(option);
                });
              });
          });
        });
    });
  });

// When the user clicks the "Find Parts" button, make an HTTP request to the car parts API to get
// a list of car parts that are compatible with the selected car
findParts.addEventListener("click", () => {
  const selectedMake = makes.find((make) => make.id === parseInt(make.value));
  const selectedModel = models.find(
    (model) => model.make_id === selectedMake.id && model.id === parseInt(model.value)
  );
  const selectedYear = years.find(
    (year) => year.model_id === selectedModel.id && year === parseInt(year.value)
  );

  // Make an HTTP request to the car parts API to get a list of parts that are compatible with the
  // selected car
  fetch(`https://api.car-parts.com/parts?make
