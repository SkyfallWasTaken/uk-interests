const response = await fetch("https://interests-api.parliament.uk/api/v1/Interests/")
const json = await response.json()

for (const item of json.items) {
  console.log(`Name: ${item.member.nameDisplayAs}`)
  console.log(`Summary: ${item.summary}`)
  console.log(`Category: ${item.category.name}`)
  
  const valueField = item.fields.find(item => item.name == "Value");
  const donorNameField = item.fields.find(item => (item.name == "DonorName" || item.name == "DonorCompanyName") && item.value);  

  console.log(`Value: £${valueField ? valueField.value : "unspecified"}`)
  console.log(`Donor name: ${donorNameField ? donorNameField.value : "unspecified"}`)
  console.log()
}
