def createUniformBucketsFromSeries(pd_series, numberOfBuckets = 9):
    maxVal = pd_series.max()
    minVal = pd_series.min()
    serLen = len(pd_series)
    print("Max value:"+str(maxVal))
    print("Min value:"+str(minVal))
    print("Series Length = "+str(serLen))

    idealBucketLength = round(serLen / numberOfBuckets)
    print("Ideal bucket len:"+str(idealBucketLength))

    sorted_series = pd_series.sort_values()

    bucketBordersArray = [minVal]
    bucketValuesCounts = []

    curr_bucket_value_count = 0
    current_bucket_upper_margin_index = 1
    for value in sorted_series:
        # print("Bucket array:"+str(bucketBordersArray))
        # print("bValusCounts:"+str(bucketValuesCounts))
        # print("     Value:"+str(value))
        # print("     Curr_bucket_value_count:"+str(curr_bucket_value_count))
        #
        # print("     current_bucket_upper_margin_index:"+str(current_bucket_upper_margin_index))
        curr_bucket_value_count +=1
        if curr_bucket_value_count>=(idealBucketLength-2):
            if len(bucketBordersArray) <= current_bucket_upper_margin_index:
                #Found another upper margin
                bucketBordersArray.append(value)
            # else:
            if value <= bucketBordersArray[current_bucket_upper_margin_index]:
                #Here we depend on sorting of the series (ascending)
                #Skip the Value
                # print("Skipping the value")
                pass
            else:
                current_bucket_upper_margin_index +=1
                bucketValuesCounts.append(curr_bucket_value_count)
                curr_bucket_value_count = 0

    bucketValuesCounts.append(curr_bucket_value_count)
    bucketBordersArray.append(maxVal)

    print("Bucket value counts:"+str(bucketValuesCounts))
    return bucketBordersArray
