const response = await fetch("https://interests-api.parliament.uk/api/v1/Interests/")
const json = await response.json()

interface Interest {
  member: {
    nameDisplayAs: string
  }
  summary: string
  category: {
    name: string
  }
  fields: { name: string, value: any }[]
}

for (const item of (json.items as Interest[])) {
  console.log(`Name: ${item.member.nameDisplayAs}`)
  console.log(`Summary: ${item.summary}`)
  console.log(`Category: ${item.category.name}`)
  
  const valueField = item.fields.find((item: { name: string }) => item.name == "Value");
  const donorNameField = item.fields.find((item: { name: string; value: any }) => (item.name === "DonorName" || item.name === "DonorCompanyName") && item.value);

  console.log(`Value: £${valueField ? valueField.value : "unspecified"}`)
  console.log(`Donor name: ${donorNameField ? donorNameField.value : "unspecified"}`)
  console.log()
}
