import { writeFile } from "fs/promises"

const INITIAL_URL = "https://interests-api.parliament.uk/api/v1/Interests/"

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

interface ApiLink {
    rel: string
    href: string
}

interface ApiResponse {
    links: ApiLink[]
    items: Interest[]
}

const memberName = "Nigel Farage"
const memberApiResponse = await fetch(`https://members-api.parliament.uk/api/Members/Search?Name=${encodeURIComponent(memberName)}`)
const memberJson = await memberApiResponse.json() as { items: { value: { id: number } }[] }
const memberId = memberJson.items[0].value.id

interface Result {
    category: string
    summary: string
    value: string | number
    donorName: string
}

interface BatchResults {
    results: Result[]
    next: string | undefined
}

function processBatch(json: ApiResponse): BatchResults {
    let results = []
    for (const item of json.items) {
        const category = item.category.name
        const summary = item.summary

        const value = item.fields.find((item: { name: string }) => item.name == "Value")?.value;
        const donorName = item.fields.find((item: {
            name: string;
            value: any
        }) => (item.name === "DonorName" || item.name === "DonorCompanyName" || item.name === "DonorTrustDetails") && item.value)?.value;

        results.push({
            summary,
            category,
            value: Number(value),
            donorName,
        })
    }
    return {
        results,
        next: json.links.find((item: { rel: string }) => item.rel == "nextPage")?.href
    }
}

let nextUrl: string | undefined = INITIAL_URL
let batchNum = 0
let results = []
while (nextUrl) {
    const params = new URLSearchParams(nextUrl)
    params.set("memberId", memberId.toString())
    const response = await fetch(`${nextUrl}?${params.toString()}`)
    const json = await response.json() as ApiResponse
    const batchResults = processBatch(json)
    results.push(batchResults.results)
    nextUrl = batchResults.next
    batchNum++
}
await writeFile(`./data/${memberId}.json`, JSON.stringify(results.flat(), null, 2))

export {}