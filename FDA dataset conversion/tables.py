STUDY_TABLE_FIELDS = [
    ("org_study_id","id_info > org_study_id"),
    ("nct_id" ,  "id_info > nct_id"),
    ("url", "required_header > url"),
    ("brief_title" ,  "brief_title"),
    ("official_title", "official_title"),
    ("source" ,  "source"),
    ("brief_summary" ,  "brief_summary > textblock"),
    ("detailed_description" ,  "detailed_description > textblock"),
    ("overall_status" ,  "overall_status"),
    ("last_known_status", "last_known_status"),
    ("start_date", "start_date"),
    ("completion_date", "completion_date"),
    ("phase",  "phase"),
    ("study_type" ,  "study_type"),
    ("has_expanded_access" ,  "has_expanded_access"),
    ("allocation", "study_design_info > allocation"),
    ("intervention_model" ,  "study_design_info > intervention_model"),
    ("primary_purpose" ,  "study_design_info > primary_purpose"),
    ("masking" ,  "study_design_info > masking"),

    ("study_first_submitted", "study_first_submitted"),
    ("study_first_submitted_qc", "study_first_submitted_qc"),
    ("last_update_submitted", "last_update_submitted"),

    # ("country" ,  "location_countries > country"),#To check how warning word for duplicate entries in main table
    # ("country2" ,  "location_countries > country2")#THis is fake field to test how not existing are treated
]#END STUDY_TABLE_FIELDS = [


#Multicountries example - NCT00110110.xml
LOCATION_COUNTRIES = [
    ("nct_id" ,  "id_info > nct_id"),
    ("country" ,  "location_countries > country"),

    # ("country2" ,  "location_countries > country2")#THis is fake field to test how not existing are treated
    # ("intervention_name", "intervention > intervention_name") #This is added to test join of multitables
]

CONDITIONS = [
    ("nct_id" ,  "id_info > nct_id"),
    ("condition" ,  "condition")
]

#This table is not included into processing - have to think what to do with linked arrays in XML
# INTERVENTIONS = [
#     ("nct_id" ,  "id_info > nct_id"),
#     ("intervention_type" ,  "intervention > intervention_type"),
#     ("intervention_name" ,  "intervention > intervention_name")
# ]
