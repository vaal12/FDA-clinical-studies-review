# Choropleth of clinical trials number per country (as per FDA database - https://clinicaltrials.gov/)


## What this does
Interactive map of the world with information about countries and details of countries. Also provides choropleth of trials per capita and trials per area (of the country)

https://vaal12.github.io/FDA-clinical-studies-review/html/index.html

Map is interactive (allows for zoom/pan) + click on the country provides more details in the side panel.


## Data Source

Infographics is built from the SQLite database made by parsing 6.34 GB of 288 000 XML files (see my other project for that - https://github.com/vaal12/Sqlite-converter-for-clinicaltrials.gov) 

## Notes

Web part is built over d3 graphing network over semi manually cleaned world map in SVG format.

D3 is used for loading/parsing of datasets and for making infographicst interactive.

C3 graphing library is used to make bar charts of trials/year in country details side panel.

Jupyter notebooks are used for preparing the data for web app to consume and to clean / scrap (from wikipedia) country information.



## License
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

[//]: <> (Author SHA-512: c46c48ddaccc53835237b551df240c1dc51ca78911fdec845481c04bb2bb438b71ed15431131850dd2654a136047dbe3129c728d4148f971d3bc0d7568124a86)
