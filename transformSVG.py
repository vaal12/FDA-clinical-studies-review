from bs4 import BeautifulSoup

def getNumberBucket(number, bucketsArray):
    bucketIndex = 0
    for upperBucketMargin in bucketsArray[1:]:
        if number<=upperBucketMargin: return bucketIndex
        bucketIndex +=1
    return bucketIndex

def transformCountrySVG(countriesListDF, bucketsArray, colorArray):
    #Do not indicate parser - lxml will be used and this is fine as other produce some weird processing of the document.
    with open("world-map_20Sep2018.svg") as fp:
        #XML is needed as html.parser does something unspeakable to the code
        soup = BeautifulSoup(fp, features="xml") #, features="html5" "html.parser", "lxml"

    # print("bucket array:"+str(bucketsArray))
    # print("color array:{}".format(colorArray))


    country_buckets = []
    for rng in bucketsArray[1:]:
        country_buckets.append([])

    for index, country in countriesListDF.iterrows():
        # print(str(index))
        # print(country["iso2"])
        # print(country["nct_id_count"])
        # print("Bucket:"+str(getNumberBucket(country["nct_id_count"], bucketsArray)))
        if not (country["iso2"].startswith('no_code')):
            country_buckets[getNumberBucket(country["nct_id_count"], bucketsArray)].append(country["iso2"])
            # print("Have ISO2:"+country["iso2"])
            country_g_tag = soup.svg.find("g", {"id":country["iso2"]}, recursive=False)
            # print("Found g tag:"+str(country_g_tag))
            if not (country_g_tag is None):
                # print("Title tag:"+str(country_g_tag.title))
                country_g_tag.title.string.replace_with("")
                country_g_tag.title.append(country["full_country_name"])
                country_g_tag.title.append("Number of trials:"+str(country["nct_id_count"]))
                # print("After addition:"+str(country_g_tag.title))

    for idx in range(0, len(bucketsArray)-1):
        pass
        # print("Bucket #:"+str(idx))
        # print(str(country_buckets[idx]))
        # print("Length:"+str(len(country_buckets[idx])))
    # print("Result:"+str(country_buckets))

    CSS_LINE = ""

    colorIdx = 0
    for bucket in country_buckets:
        for country in bucket:
            CSS_LINE += "."+country+", "

        #BElow is to remove last comma
        # print("Country list")
        # print(CSS_LINE[:-2])
        CSS_LINE = CSS_LINE+" .legendclr"+str(colorIdx)+" {   fill:"+ colorArray[colorIdx]+";    } \n\n"
        # CSS_LINE = CSS_LINE+" .legendclr"+str(colorIdx)+" { fill:"+ colorArray[colorIdx]+";    } \n\n"
        colorIdx +=1

    # print("CSS:"+CSS_LINE)

    soup.svg.style.append(CSS_LINE)

    baseline_y = 670

    PLANK_WIDTH = "240"
    PLANK_HEIGHT = "50"
    PLANK_HEIGHT_INT = 50

    for idx in range(0, len(colorArray)):
        # print("Processing IDx:{}".format(idx))
        new_g_tag = soup.new_tag("g", transform="translate(280,"+
                        str(baseline_y+idx*(PLANK_HEIGHT_INT+20))+")")
        new_rect_tag = soup.new_tag("rect",
                rx="5", ry="5",
                **{"width": PLANK_WIDTH,
                    "height" : PLANK_HEIGHT,
                    "stroke" : "green",
                    "class" : "legendclr"+str(idx)
                })

        new_svg_tag = soup.new_tag("svg", width=PLANK_WIDTH,height=PLANK_HEIGHT)
        new_text_tag = soup.new_tag("text", x="50%", y="50%",
                **{
                    "text-anchor":"middle",
                    "alignment-baseline":"central",
                    "dominant-baseline":"central",
                    "font-family":"Verdana",
                    "font-size":"24"
                })
        #https://www.w3.org/wiki/Common_HTML_entities_used_for_typography
        if idx != 0:
            new_text_tag.append(u">"+str(bucketsArray[idx-1])+u" - ≤"+str(bucketsArray[idx]))
        else:
            new_text_tag.append(">0 - ≤"+str(bucketsArray[idx]))

        new_svg_tag.append(new_text_tag)
        new_g_tag.append(new_rect_tag)
        new_g_tag.append(new_svg_tag)
        soup.svg.append(new_g_tag)

    # https://beautiful-soup-4.readthedocs.io/en/latest/
    pretty = soup.prettify(formatter="minimal")

    out_file = open("world-map_out.svg", "wb")
    out_file.write(str(pretty).encode("utf-8"))

    return pretty
