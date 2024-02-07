const make = document.getElementById("make");
const model = document.getElementById("model");
const year = document.getElementById("year");

// Sample data (remove this in a real-world application)
const makes = [
  { id: 1, name: "Toyota" },
  { id: 2, name: "Honda" },
  { id: 3, name: "Mercedes" },
];

const models = [
  { id: 1, make_id: 2, name: "Civic" },
  { id: 2, make_id: 2, name: "Accord" },
  { id: 3, make_id: 3, name: "C-Class" },
];

const years = [
  { id: 1, model_id: 1, year: 2015 },
  { id: 2, model_id: 1, year: 2016 },
  { id: 3, model_id: 2, year: 2015 },
  { id: 4, model_id: 2, year: 2016 },
  { id: 5, model_id: 3, year: 2015 },
];

// Populate the make dropdown
makes.forEach((make) => {
  const option = document.createElement("option");
  option.value = make.id;
  option.textContent = make.name;
  make.appendChild(option);
});

// When the make dropdown changes, populate the model dropdown
make.addEventListener("change", () => {
  model.innerHTML = "";
  const selectedMake = makes.find((make) => make.id === parseInt(make.value));
  models
    .filter((model) => model.make_id === selectedMake.id)
    .forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name;
      model.appendChild(option);
    });
});

// When the model dropdown changes, populate the year dropdown
model.addEventListener("change", () => {
  year.innerHTML = "";
  const selectedModel = models.find((model) => model.id === parseInt(model.value));
  years
    .filter((year) => year.model_id === selectedModel.id)
    .forEach((year) => {
      const option = document.createElement("option");
      option.value = year.year;
      option.textContent = year.year;
      year.appendChild(option);
    });
});
