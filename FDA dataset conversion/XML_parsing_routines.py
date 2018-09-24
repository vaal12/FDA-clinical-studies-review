import logging

#https://docs.python.org/2/library/xml.etree.elementtree.html
import xml.etree.ElementTree as ET

import tables

def getTagTextOrEmptyStr(parentTag, tagName):
    if not isinstance(parentTag.find(tagName), type(None)):
        parentTag.find(tagName).text
        print(parentTag.find(tagName).text)
        return parentTag.find(tagName).text
    else:
        print "No tag found "+tagName
        return ""

def parseXMLKeyBranch(parentNode, childNodeBranchList):
    logging.debug("")
    # logging.debug("")
    curr_tabStr = "\t"*(4-len(childNodeBranchList))

    logging.debug(curr_tabStr+"parseXMLKeyBranch parentNodeName:"+parentNode.tag)
    logging.debug(curr_tabStr+"parseXMLKeyBranch parsing list:"+str(childNodeBranchList))
    # logging.debug( "Iterating over child tag:"+childNodeBranchList[0])
    currNodeBranchTag = childNodeBranchList[0]
    del childNodeBranchList[0]

    if not isinstance(parentNode.find(currNodeBranchTag), type(None)):
        #Found the child node
        if len(childNodeBranchList)==0:
            #THis is the last child in branch
            # logging.debug( "Found tag text:"+parentNode.find(currNodeBranchTag).text)
            return parentNode.find(currNodeBranchTag).text
        else:
            # This is not the last child in branch - recursing downs
            logging.debug(curr_tabStr+"This is Recursion.")
            return parseXMLKeyBranch(parentNode.find(currNodeBranchTag), childNodeBranchList)
            pass
    else:
        #Not found the node - returning None
        return None
#END def parseXMLKeyBranch(parentNode, childNodeBranchList):



#Works as CrossJoin on data: https://www.w3resource.com/sql/joins/cross-join.php
def parseXMLKeyBranchWithList(parentNode, childNodeBranchList):
    logging.debug("")
    # logging.debug("")
    curr_tabStr = "\t"*(4-len(childNodeBranchList))
    logging.debug(curr_tabStr+"parseXMLKeyBranchWithList parentNodeName:"+parentNode.tag)
    logging.debug(curr_tabStr+"parseXMLKeyBranchWithList parsing list:"+str(childNodeBranchList))
    # logging.debug("Iterating over child tag:"+childNodeBranchList[0])
    currNodeBranchTag = childNodeBranchList[0]
    del childNodeBranchList[0]

    retList = []

    if not (parentNode.find(currNodeBranchTag) is None):
        foundTextsOfNodes = []
        #Found the child node
        if len(childNodeBranchList)==0:
            #THis is the last child in branch
            # logging.debug( "Found tag text:"+parentNode.find(currNodeBranchTag).text)
            for foundNode in parentNode.findall(currNodeBranchTag):
                foundTextsOfNodes.append(foundNode.text)
            return foundTextsOfNodes
        else:
            # This is not the last child in branch - recursing downs
            logging.debug(curr_tabStr+"This is Recursion.")
            for foundNode in parentNode.findall(currNodeBranchTag):

                foundTextsOfNodes.extend(parseXMLKeyBranchWithList(foundNode,
                                            list(childNodeBranchList)))
            return foundTextsOfNodes
        #END if len(childNodeBranchList)==0:

    else:
        #Not found the node - returning empty list
        logging.debug(curr_tabStr+"Node not found. Returning empty list")
        return []
    #END if not (parentNode.find(currNodeBranchTag) is None):
#END def parseXMLKeyBranch(parentNode, childNodeBranchList):



def processSecondaryTables(rootNode, tables_writers_list):
    for table_writer in tables_writers_list[1:]:
        print(str(table_writer))
        logging.debug("Processing secondary table:"+str(table_writer[1]))
        # StudyTableRec = []
        StudyTableRecList = []
        #Processing main table (which should not have duplicate entries - one row per file)
        #This will issue warning into LOG file about found multiple entries in main table

        for table_key in (table_writer[1]):
            logging.debug("")
            logging.debug("\tProcessing field:"+table_key[0]+" path:"+table_key[1])

            childNodeBranchList = table_key[1].replace(" ", "").split('>')
            logging.debug("")
            logging.debug("")
            keyBranchText = parseXMLKeyBranchWithList(rootNode,
                                                        childNodeBranchList)
            # keyBranchTextArray = []
            # keyBranchTextArray = parseXMLKeyBranchWithList(rootNode, childNodeBranchList)

            OldStudyTableRecList = list(StudyTableRecList)
            StudyTableRecList = []

            # logging.debug("OldStudyTableRecList:"+str(OldStudyTableRecList))

            if len(keyBranchText) >0: #None is not returned by list processing parseXMLKeyBranchWithList
                logging.debug("keyBranchText:"+(str(keyBranchText))[:30])
                #StudyTableRec.append(keyBranchText.strip().encode("utf-8"))
                #StudyTableRec.append(keyBranchText)
                for key_text in keyBranchText:
                    logging.debug("Processing key:"+key_text[:30])
                    if len(OldStudyTableRecList) == 0:
                        OldStudyTableRecList.append([])

                    for tableRecord in OldStudyTableRecList:
                        logging.debug("Processing old tableRec:"+str(tableRecord))
                        newTableRec = list(tableRecord)
                        newTableRec.append(key_text.strip().encode("utf-8"))
                        StudyTableRecList.append(newTableRec)

                    # StudyTableRec.append(key_text)
                    # logging.debug("StudyTableRec:"+str(StudyTableRec))
                    # table_writer[0].writerow(StudyTableRec)
                    #
                    # StudyTableRec.pop()
                    # logging.debug("StudyTableRec after:"+str(StudyTableRec))

            else:# this means that, len(keyBranchText) = 0
                logging.debug("keyBranchText of length ZERO")
                if len(OldStudyTableRecList) == 0:
                    OldStudyTableRecList.append([])
                for tableRecord in OldStudyTableRecList:
                    tableRecord.append("**None**")
                    StudyTableRecList.append(tableRecord)
            #END if keyBranchText is not None:

            # logging.debug("New StudyTableRecList:"+str(StudyTableRecList))

        #END for table_key in (table_writer[1]):

        for tableRow in StudyTableRecList:
            table_writer[0].writerow(tableRow)
    #END for table_writer in tables_writers_list[1:]:

#END def processSecondaryTables(rootNode, tables_writers_list):






def parserXMLNCTFile2(fileName, tables_writers_list):
    logging.debug("")
    logging.debug("")
    logging.debug("")
    logging.debug("")
    logging.debug("")
    logging.debug("")
    logging.debug("*********************************************************")
    logging.debug("*********************************************************")
    logging.debug("*********************************************************")
    logging.debug( "parserXMLNCTFile2. parsing file:"+fileName)
    logging.debug("*********************************************************")
    logging.debug("*********************************************************")
    logging.debug("*********************************************************")
    logging.debug("")
    logging.debug("")

    tree = ET.parse(fileName)
    root = tree.getroot()
    #Parsing for study table fields - assuming one tag per record
    StudyTableRec = []
    mainTableCSVWriter = tables_writers_list[0][0]
    for key_tuple in tables_writers_list[0][1]:
        key = key_tuple[0]
        xml_path = key_tuple[1]
        logging.debug( "Parsing for key:"+key)
        logging.debug( "Key path:"+xml_path)
        childNodeBranchList = xml_path.replace(" ", "").split('>')

        # keyBranchText = parseXMLKeyBranch(root, childNodeBranchList)
        keyBranchTextArray = parseXMLKeyBranchWithList(root, childNodeBranchList)

        if len(keyBranchTextArray)>1:#This is primary table - we do not need any duplicates - will put a warning to log file
            logging.debug("")
            logging.debug("")
            logging.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            logging.debug("     !!WARNING!!")
            logging.debug("File:"+fileName)
            logging.debug("Has duplicate XML key at path:"+xml_path)
            logging.debug("List returned by parseXMLKeyBranchWithList:"+str(keyBranchTextArray))
            logging.debug("Advised to review Main study table fields to remove this field.")
            logging.debug("So main table will only contain one record per XML file (nct_id will serve as primary key for secondary tables).")
            logging.debug("Move any data of interest, which can have multiple entries per XML file to secondary tables.")
            logging.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            logging.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            logging.debug("")
            logging.debug("")


        # logging.debug( "childNodeBranchList at the end:"+str(childNodeBranchList))

        if len(keyBranchTextArray) > 0:#field found
            keyBranchText = keyBranchTextArray[0]
            logging.debug("keyBranchText:"+keyBranchText[:30])
            StudyTableRec.append(keyBranchText.strip().encode("utf-8"))
            # StudyTableRec.append(keyBranchText)
        else:#Field not found - putting NONE to datatable
            logging.debug("keyBranchText IS NONE")
            StudyTableRec.append("**None**")
        #END for key_tuple in tables_writers_list[0][1]:
    mainTableCSVWriter.writerow(StudyTableRec)

    #Processing secondary tables
    logging.debug("************************************************************")
    logging.debug("************************************************************")

    logging.debug("Secondary tables of file:"+fileName)
    processSecondaryTables(root, tables_writers_list)
#END def parserXMLNCTFile2(fileName):
