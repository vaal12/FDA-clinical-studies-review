import logging
from datetime import datetime

import os
import csv
import colorama

import tables
import XML_parsing_routines


# XML_FILE_DIR = "c:\\Dev\\4. Python\\03.1 test XML data from FDA\\"
# XML_FILE_DIR = "c:\\Dev\\4. Python\\03.2 NCTs_FULL_SET\\"
XML_FILE_DIR = "c:\\Dev\\4. Python\\03.3 NCTs_FULL_SET_21Sep\\" 
PATH_TO_RESULT_DIR = "c:\\Dev\\4. Python\\03. XML converter of FDA list\\"



#https://docs.python.org/3/library/csv.html
def CreateCSVWriterFromTableFields(file_name, table_fields_list):
    CSVWriterMainTable=csv.writer(open(file_name,"wb"))

    #Generate field list for Study table
    table_fields = []
    for key_tuple in table_fields_list:
        table_fields.append(key_tuple[0])

    print ("Study table fields:"+str(table_fields))

    CSVWriterMainTable.writerow(table_fields)

    return CSVWriterMainTable




def parseXMLFilesInDir(fileDirPath, totalFileNumberInDir, tables_writers_list):
    fileCounter = 0



    for dirName, subdirList, fileList in os.walk(fileDirPath):
        print('Found directory: %s' % dirName)
        for fname in fileList:
            print(colorama.ansi.clear_screen())
            fileCounter +=1
            print("DIR:"+dirName)
            print("  FILE:"+fname)
            # print('\t\t\t\t\t%s' % fname)
            logging.debug(dirName)
            logging.debug('\t\t\t\t\t%s' % fname)
            print("\n\nCurrent file number:%i of %i  (%2.1f %%)"%(fileCounter,
                                    totalFileNumberInDir,
                                    (fileCounter*100/totalFileNumberInDir)))
            logging.debug("Current file number:%i"%(fileCounter))
            # print("\t\t Total number of files:%i"%(totalFileNumberInDir))
            XML_parsing_routines.parserXMLNCTFile2(dirName+"\\\\"+fname,
                                        tables_writers_list)


    # print ("Files done so far:%i"%fileCounter)




def countFiles(fileDirPath):
    fileCounter = 0
    print("Calculating total number of files")

    logging.debug("Calculating total number of files")
    logging.debug(fileDirPath)
    # global totalFileNumberInDir
    # global pause_execution
    for dirName, subdirList, fileList in os.walk(fileDirPath):
        for fname in fileList:
            fileCounter+=1
    logging.debug(("Total number of files in dir:%i"%fileCounter))
    return fileCounter


import signal
import sys

def signal_handler(signal, frame):
    print("hallo")
    global pause_execution
    pause_execution = True
    d = raw_input("Paused. Do you want to exit? [y/n]:")
    if d=='y': sys.exit(0)


colorama.init()


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)

    #http://strftime.org/
    curr_time_str = datetime.now().strftime("%Y%b%d_%H-%M-%S")
    print(curr_time_str)
    PATH_TO_RESULT_DIR = PATH_TO_RESULT_DIR+curr_time_str+"\\"
    os.mkdir(PATH_TO_RESULT_DIR)

    logging.basicConfig(filename=PATH_TO_RESULT_DIR+curr_time_str+'.log',level=logging.DEBUG)



    logging.debug('This message should go to the log file')
    # logging.info('So should this')
    # logging.warning('And this, too')

    mainTableCSVFileName = PATH_TO_RESULT_DIR+"FDA_DB_MAIN_TABLE_"+curr_time_str+".csv"
    mainTableCSVWriter = CreateCSVWriterFromTableFields(mainTableCSVFileName, tables.STUDY_TABLE_FIELDS)
    logging.debug("Calculating total number of files")
    totalFileNumberInDir = countFiles(XML_FILE_DIR)

    TABLES_WRITERS_LIST = []
    mainTableTuple = (mainTableCSVWriter, tables.STUDY_TABLE_FIELDS)
    TABLES_WRITERS_LIST.append(mainTableTuple)

    locTableTuple = (
        CreateCSVWriterFromTableFields(PATH_TO_RESULT_DIR+"FDA_DB_COUNTRY_LOC_TABLE_"+curr_time_str+".csv",
                                        tables.LOCATION_COUNTRIES),
                                        tables.LOCATION_COUNTRIES
    )
    TABLES_WRITERS_LIST.append(locTableTuple)

    #Not decided what to do with linked arrays in XML
    # interventionsTableTuple = (
    #     CreateCSVWriterFromTableFields(PATH_TO_RESULT_DIR+"FDA_DB_COUNTRY_INTERV_TABLE_"+curr_time_str+".csv",
    #                                     tables.INTERVENTIONS),
    #                                     tables.INTERVENTIONS
    # )
    # TABLES_WRITERS_LIST.append(interventionsTableTuple)

    conditionsTableTuple = (
        CreateCSVWriterFromTableFields(PATH_TO_RESULT_DIR+"FDA_DB_CONDITIONS_TABLE_"+curr_time_str+".csv",
                                        tables.CONDITIONS),
                                        tables.CONDITIONS
    )
    TABLES_WRITERS_LIST.append(conditionsTableTuple)





    logging.debug("List of tables Writers:\n"+str(TABLES_WRITERS_LIST))

    parseXMLFilesInDir(XML_FILE_DIR, totalFileNumberInDir, TABLES_WRITERS_LIST)

    print("Everything is OK. Finished.")
