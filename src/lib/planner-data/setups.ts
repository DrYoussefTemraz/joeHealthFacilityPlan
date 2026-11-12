import type { RecommendedAsset } from "@/lib/types";

/** Compact helper for the recommended-setup lists. */
export const q = (assetId: string, quantity = 1): RecommendedAsset => ({
  assetId,
  quantity,
});

export const patientRoomSetup: RecommendedAsset[] = [
  q("hospital-bed-electric"),
  q("overbed-table"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("iv-pole"),
  q("patient-monitor"),
  q("nurse-call-pillow-speaker"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const doublePatientRoomSetup: RecommendedAsset[] = [
  q("hospital-bed-electric", 2),
  q("overbed-table", 2),
  q("bedside-cabinet", 2),
  q("patient-locker"),
  q("privacy-curtain", 2),
  q("iv-pole", 2),
  q("patient-monitor", 2),
  q("nurse-call-pillow-speaker", 2),
  q("oxygen-flowmeter", 2),
  q("suction-regulator", 2),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const isolationSetup: RecommendedAsset[] = [
  ...patientRoomSetup,
  q("negative-pressure-unit"),
  q("hepa-air-purifier"),
  q("isolation-cart"),
];

export const bariatricSetup: RecommendedAsset[] = [
  q("bariatric-bed"),
  q("patient-lift"),
  q("ceiling-lift"),
  q("overbed-table"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("iv-pole"),
  q("patient-monitor"),
  q("nurse-call-pillow-speaker"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const behavioralSetup: RecommendedAsset[] = [
  q("hospital-bed-electric"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("nurse-call-pillow-speaker"),
  q("patient-monitor"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("guest-chair"),
  q("waste-bin"),
];

export const palliativeSetup: RecommendedAsset[] = [
  ...patientRoomSetup,
  q("patient-recliner"),
  q("guest-chair", 2),
  q("lounge-sofa"),
];

export const icuSetup: RecommendedAsset[] = [
  q("icu-bed"),
  q("patient-monitor"),
  q("icu-ventilator"),
  q("infusion-pump", 2),
  q("syringe-pump", 2),
  q("iv-pole", 2),
  q("overbed-table"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("monitor-mount"),
  q("suction-regulator"),
  q("oxygen-flowmeter"),
  q("airway-cart"),
  q("crash-cart"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const ccuSetup: RecommendedAsset[] = [
  ...icuSetup,
  q("echocardiography-machine"),
  q("pacemaker-programmer"),
  q("cardiac-output-monitor"),
  q("intra-aortic-balloon-pump"),
];

export const nicuSetup: RecommendedAsset[] = [
  q("infant-incubator"),
  q("infant-warmer"),
  q("infant-scale"),
  q("phototherapy-unit"),
  q("patient-monitor"),
  q("infusion-pump", 2),
  q("syringe-pump", 2),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("airway-cart"),
  q("iv-pole"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const picuSetup: RecommendedAsset[] = [
  q("icu-bed"),
  q("patient-monitor"),
  q("icu-ventilator"),
  q("infusion-pump", 2),
  q("syringe-pump", 2),
  q("feeding-pump"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("airway-cart"),
  q("crash-cart"),
  q("iv-pole"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const traumaIcuSetup: RecommendedAsset[] = [
  ...icuSetup,
  q("rapid-infuser"),
  q("blood-warmer"),
  q("transcranial-doppler"),
];

export const burnSetup: RecommendedAsset[] = [
  ...icuSetup,
  q("patient-lift"),
  q("ceiling-lift"),
  q("hepa-air-purifier"),
  q("isolation-cart"),
];

export const stepDownSetup: RecommendedAsset[] = [
  q("hospital-bed-electric"),
  q("patient-monitor"),
  q("telemetry-monitor"),
  q("infusion-pump"),
  q("iv-pole"),
  q("overbed-table"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("nurse-call-pillow-speaker"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const highDependencySetup: RecommendedAsset[] = [
  ...stepDownSetup,
  q("cpap-bipap"),
  q("high-flow-system"),
];

export const ldrSetup: RecommendedAsset[] = [
  q("birthing-bed"),
  q("fetal-monitor"),
  q("patient-monitor"),
  q("infusion-pump", 2),
  q("syringe-pump"),
  q("handheld-doppler"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("iv-pole", 2),
  q("overbed-table"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("infant-warmer"),
  q("infant-scale"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const postpartumSetup: RecommendedAsset[] = [
  ...patientRoomSetup,
  q("bassinet"),
  q("infant-scale"),
  q("patient-recliner"),
  q("infant-changing-table"),
];

export const antepartumSetup: RecommendedAsset[] = [
  ...patientRoomSetup,
  q("fetal-monitor"),
  q("handheld-doppler"),
];

export const nurserySetup: RecommendedAsset[] = [
  q("bassinet", 6),
  q("infant-warmer", 2),
  q("infant-scale", 2),
  q("phototherapy-unit", 2),
  q("patient-monitor", 2),
  q("oxygen-flowmeter", 2),
  q("suction-regulator", 2),
  q("waste-bin"),
];

export const pediatricSetup: RecommendedAsset[] = [
  ...patientRoomSetup,
  q("pediatric-crib"),
  q("infant-changing-table"),
  q("patient-recliner"),
];

export const playSetup: RecommendedAsset[] = [
  q("side-chair", 4),
  q("lounge-sofa"),
  q("coffee-table"),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const orSetup: RecommendedAsset[] = [
  q("operating-table"),
  q("surgical-lights"),
  q("anesthesia-machine"),
  q("patient-monitor"),
  q("capnography-monitor"),
  q("bis-monitor"),
  q("electrosurgical-generator"),
  q("surgical-suction-unit"),
  q("mayo-stand"),
  q("instrument-trolley"),
  q("back-table"),
  q("sterile-instrument-table"),
  q("anesthesia-cart"),
  q("iv-pole"),
  q("suction-regulator"),
  q("oxygen-flowmeter"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const hybridOrSetup: RecommendedAsset[] = [
  ...orSetup,
  q("c-arm"),
  q("surgical-navigation"),
  q("surgical-microscope"),
];

export const cathLabSetup: RecommendedAsset[] = [
  q("c-arm"),
  q("patient-monitor"),
  q("cardiac-output-monitor"),
  q("intra-aortic-balloon-pump"),
  q("defibrillator"),
  q("pacemaker-programmer"),
  q("contrast-injector"),
  q("rapid-infuser"),
  q("blood-warmer"),
  q("operating-table"),
  q("surgical-lights"),
  q("surgical-suction-unit"),
  q("iv-pole", 2),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const irSetup: RecommendedAsset[] = [
  ...cathLabSetup,
  q("ultrasound-cart"),
  q("surgical-navigation"),
];

export const endoscopySetup: RecommendedAsset[] = [
  q("endoscopy-tower"),
  q("endoscope-reprocessor"),
  q("procedure-table"),
  q("patient-monitor"),
  q("capnography-monitor"),
  q("electrosurgical-generator"),
  q("suction-regulator"),
  q("oxygen-flowmeter"),
  q("iv-pole"),
  q("instrument-trolley"),
  q("dressing-trolley"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const minorProcedureSetup: RecommendedAsset[] = [
  q("procedure-table"),
  q("exam-light"),
  q("patient-monitor"),
  q("electrosurgical-generator"),
  q("suction-regulator"),
  q("oxygen-flowmeter"),
  q("instrument-trolley"),
  q("dressing-trolley"),
  q("iv-pole"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const preOpSetup: RecommendedAsset[] = [
  q("stretcher"),
  q("patient-monitor"),
  q("infusion-pump"),
  q("iv-pole"),
  q("blood-pressure-monitor"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("privacy-curtain"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const pacuSetup: RecommendedAsset[] = [
  q("icu-bed"),
  q("patient-monitor"),
  q("capnography-monitor"),
  q("infusion-pump"),
  q("syringe-pump"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("iv-pole"),
  q("privacy-curtain"),
  q("crash-cart"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const phase2Setup: RecommendedAsset[] = [
  q("patient-recliner"),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("oxygen-flowmeter"),
  q("iv-pole"),
  q("privacy-curtain"),
  q("waste-bin"),
];

export const sterileCoreSetup: RecommendedAsset[] = [
  q("case-cart", 2),
  q("instrument-trolley", 2),
  q("sterile-instrument-table", 2),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const anesthesiaWorkroomSetup: RecommendedAsset[] = [
  q("anesthesia-cart", 2),
  q("airway-cart"),
  q("storage-cabinet", 2),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const castSetup: RecommendedAsset[] = [
  q("casting-table"),
  q("exam-light"),
  q("dressing-trolley"),
  q("treatment-cart"),
  q("wheelchair"),
  q("waste-bin"),
];

export const edExamSetup: RecommendedAsset[] = [
  q("stretcher"),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("pulse-oximeter"),
  q("infusion-pump"),
  q("iv-pole"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("privacy-curtain"),
  q("treatment-cart"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const traumaResusSetup: RecommendedAsset[] = [
  q("stretcher"),
  q("patient-monitor"),
  q("defibrillator"),
  q("icu-ventilator"),
  q("rapid-infuser"),
  q("blood-warmer"),
  q("infusion-pump", 2),
  q("syringe-pump", 2),
  q("iv-pole", 2),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("airway-cart"),
  q("crash-cart"),
  q("surgical-lights"),
  q("point-of-care-ultrasound"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const triageSetup: RecommendedAsset[] = [
  q("exam-table"),
  q("blood-pressure-monitor"),
  q("pulse-oximeter"),
  q("tympanic-thermometer"),
  q("glucometer"),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const behavioralCrisisSetup: RecommendedAsset[] = [
  q("hospital-bed-electric"),
  q("patient-monitor"),
  q("nurse-call-pillow-speaker"),
  q("guest-chair", 2),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const deconSetup: RecommendedAsset[] = [
  q("stretcher"),
  q("patient-monitor"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("negative-pressure-unit"),
  q("hepa-air-purifier"),
  q("isolation-cart"),
  q("shower-chair"),
  q("waste-bin"),
];

export const ambulanceBaySetup: RecommendedAsset[] = [
  q("stretcher", 2),
  q("wheelchair", 2),
  q("oxygen-cylinder-cart", 2),
  q("treatment-cart"),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const mriSetup: RecommendedAsset[] = [
  q("mri-1-5t"),
  q("contrast-injector"),
  q("patient-monitor"),
  q("transport-ventilator"),
  q("stretcher"),
  q("wheelchair"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const ctSetup: RecommendedAsset[] = [
  q("ct-64-slice"),
  q("contrast-injector"),
  q("patient-monitor"),
  q("stretcher"),
  q("wheelchair"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const xraySetup: RecommendedAsset[] = [
  q("digital-xray-room"),
  q("mobile-xray"),
  q("wheelchair"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const ultrasoundSetup: RecommendedAsset[] = [
  q("ultrasound-cart"),
  q("exam-table"),
  q("patient-monitor"),
  q("wheelchair"),
  q("waste-bin"),
];

export const mammoSetup: RecommendedAsset[] = [
  q("mammography"),
  q("exam-light"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const nuclearSetup: RecommendedAsset[] = [
  q("spect-gamma-camera"),
  q("patient-monitor"),
  q("stretcher"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const petCtSetup: RecommendedAsset[] = [
  q("pet-ct"),
  q("contrast-injector"),
  q("patient-monitor"),
  q("stretcher"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const fluoroSetup: RecommendedAsset[] = [
  q("c-arm"),
  q("patient-monitor"),
  q("stretcher"),
  q("contrast-injector"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const echoSetup: RecommendedAsset[] = [
  q("echocardiography-machine"),
  q("stress-test-system"),
  q("ecg-machine"),
  q("exam-table"),
  q("patient-monitor"),
  q("waste-bin"),
];

export const dexaSetup: RecommendedAsset[] = [
  q("dexa"),
  q("exam-table"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const linacSetup: RecommendedAsset[] = [
  q("linear-accelerator"),
  q("patient-monitor"),
  q("stretcher"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const chemistrySetup: RecommendedAsset[] = [
  q("chemistry-analyzer"),
  q("blood-gas-analyzer"),
  q("lab-microscope"),
  q("biosafety-cabinet"),
  q("office-desk", 2),
  q("task-chair", 2),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const hematologySetup: RecommendedAsset[] = [
  q("hematology-analyzer"),
  q("coagulation-analyzer"),
  q("lab-microscope", 2),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const microSetup: RecommendedAsset[] = [
  q("microbiology-incubator", 2),
  q("pcr-thermocycler"),
  q("biosafety-cabinet"),
  q("lab-microscope", 2),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const bloodBankSetup: RecommendedAsset[] = [
  q("blood-bank-refrigerator", 2),
  q("plasma-freezer"),
  q("platelet-incubator"),
  q("lab-microscope"),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const histologySetup: RecommendedAsset[] = [
  q("fume-hood"),
  q("biosafety-cabinet"),
  q("lab-microscope", 2),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const cytologySetup: RecommendedAsset[] = [
  q("biosafety-cabinet"),
  q("lab-microscope", 2),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const phlebotomySetup: RecommendedAsset[] = [
  q("exam-table"),
  q("office-desk"),
  q("task-chair"),
  q("guest-chair", 2),
  q("specimen-transport-cart"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const poctSetup: RecommendedAsset[] = [
  q("blood-gas-analyzer"),
  q("glucometer"),
  q("coagulation-analyzer"),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const autopsySetup: RecommendedAsset[] = [
  q("fume-hood"),
  q("procedure-table"),
  q("lab-microscope"),
  q("specimen-transport-cart"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const mainPharmacySetup: RecommendedAsset[] = [
  q("office-desk", 2),
  q("task-chair", 2),
  q("pharmacy-refrigerator", 2),
  q("storage-cabinet", 4),
  q("medication-cart", 2),
  q("pneumatic-tube-station"),
  q("whiteboard"),
  q("waste-bin"),
  q("recycling-station"),
];

export const ivCleanroomSetup: RecommendedAsset[] = [
  q("iv-compounding-isolator", 2),
  q("biosafety-cabinet"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const chemoSetup: RecommendedAsset[] = [
  q("chemo-biosafety-cabinet", 2),
  q("iv-compounding-isolator"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const satellitePharmacySetup: RecommendedAsset[] = [
  q("pharmacy-refrigerator"),
  q("medication-cart"),
  q("storage-cabinet", 2),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const medicationRoomSetup: RecommendedAsset[] = [
  q("medication-cart"),
  q("pharmacy-refrigerator"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const drugStorageSetup: RecommendedAsset[] = [
  q("storage-cabinet", 6),
  q("pharmacy-refrigerator"),
  q("walk-in-refrigerator"),
  q("waste-bin"),
];

export const deconCssdSetup: RecommendedAsset[] = [
  q("washer-disinfector", 2),
  q("ultrasonic-cleaner"),
  q("bedpan-washer"),
  q("instrument-trolley", 2),
  q("case-cart", 2),
  q("waste-bin"),
];

export const assemblySetup: RecommendedAsset[] = [
  q("sterile-sealer", 2),
  q("instrument-trolley", 2),
  q("sterile-instrument-table", 2),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const sterilizerSetup: RecommendedAsset[] = [
  q("steam-sterilizer", 2),
  q("sterile-sealer"),
  q("instrument-trolley", 2),
  q("waste-bin"),
];

export const sterileStorageSetup: RecommendedAsset[] = [
  q("storage-cabinet", 6),
  q("case-cart", 2),
  q("waste-bin"),
];

export const scopeSetup: RecommendedAsset[] = [
  q("endoscope-reprocessor", 2),
  q("ultrasonic-cleaner"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const dialysisSetup: RecommendedAsset[] = [
  q("dialysis-machine"),
  q("dialysis-chair"),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("infusion-pump"),
  q("iv-pole"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const homeDialysisSetup: RecommendedAsset[] = [
  q("dialysis-machine"),
  q("dialysis-chair"),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const infusionSetup: RecommendedAsset[] = [
  q("infusion-chair", 2),
  q("infusion-pump", 2),
  q("iv-pole", 2),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("oxygen-flowmeter"),
  q("suction-regulator"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const apheresisSetup: RecommendedAsset[] = [
  q("apheresis-machine"),
  q("infusion-chair"),
  q("patient-monitor"),
  q("blood-pressure-monitor"),
  q("iv-pole", 2),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const ptGymSetup: RecommendedAsset[] = [
  q("gait-harness"),
  q("traction-unit", 2),
  q("pt-ultrasound-therapy", 2),
  q("tens-unit", 2),
  q("body-composition-analyzer"),
  q("exam-table", 2),
  q("wheelchair", 2),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const otSetup: RecommendedAsset[] = [
  q("exam-table"),
  q("pt-ultrasound-therapy"),
  q("tens-unit"),
  q("storage-cabinet", 2),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const speechSetup: RecommendedAsset[] = [
  q("office-desk"),
  q("task-chair", 2),
  q("guest-chair", 2),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const hydroSetup: RecommendedAsset[] = [
  q("hydrotherapy-treadmill"),
  q("gait-harness"),
  q("shower-chair", 2),
  q("patient-lift"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const gaitSetup: RecommendedAsset[] = [
  q("gait-harness"),
  q("body-composition-analyzer"),
  q("tens-unit"),
  q("exam-table"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const examSetup: RecommendedAsset[] = [
  q("exam-table"),
  q("exam-light"),
  q("blood-pressure-monitor"),
  q("pulse-oximeter"),
  q("tympanic-thermometer"),
  q("otoscope-ophthalmoscope"),
  q("office-desk"),
  q("task-chair"),
  q("guest-chair"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const consultSetup: RecommendedAsset[] = [
  q("office-desk"),
  q("task-chair", 2),
  q("guest-chair", 2),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const telehealthSetup: RecommendedAsset[] = [
  q("office-desk"),
  q("task-chair", 2),
  q("monitor-arm", 2),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const immunizationSetup: RecommendedAsset[] = [
  q("exam-table"),
  q("vaccine-refrigerator"),
  q("office-desk"),
  q("task-chair"),
  q("treatment-cart"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const audiologySetup: RecommendedAsset[] = [
  q("audiometer"),
  q("office-desk"),
  q("task-chair", 2),
  q("guest-chair"),
  q("storage-cabinet"),
  q("waste-bin"),
];

export const ophthoSetup: RecommendedAsset[] = [
  q("exam-table"),
  q("slit-lamp"),
  q("phoropter"),
  q("exam-light"),
  q("office-desk"),
  q("task-chair"),
  q("guest-chair"),
  q("waste-bin"),
];

export const dentalSetup: RecommendedAsset[] = [
  q("dental-unit"),
  q("exam-light"),
  q("office-desk"),
  q("task-chair"),
  q("storage-cabinet", 2),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const woundSetup: RecommendedAsset[] = [
  q("procedure-table"),
  q("exam-light"),
  q("dressing-trolley"),
  q("treatment-cart"),
  q("suction-regulator"),
  q("oxygen-flowmeter"),
  q("instrument-trolley"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const minorSurgerySetup: RecommendedAsset[] = [
  q("operating-table"),
  q("surgical-lights"),
  q("anesthesia-machine"),
  q("patient-monitor"),
  q("electrosurgical-generator"),
  q("surgical-suction-unit"),
  q("mayo-stand"),
  q("instrument-trolley"),
  q("back-table"),
  q("anesthesia-cart"),
  q("iv-pole"),
  q("sharps-container-holder"),
  q("waste-bin"),
];

export const nursesStationSetup: RecommendedAsset[] = [
  q("office-desk", 2),
  q("task-chair", 2),
  q("monitor-arm", 2),
  q("printer-stand"),
  q("whiteboard"),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const receptionSetup: RecommendedAsset[] = [
  q("reception-desk"),
  q("office-desk"),
  q("task-chair", 2),
  q("waiting-bench", 2),
  q("waiting-chair-set", 2),
  q("coffee-table", 2),
  q("lounge-sofa"),
  q("waste-bin"),
  q("recycling-station"),
  q("umbrella-stand"),
];

export const cleanUtilitySetup: RecommendedAsset[] = [
  q("storage-cabinet", 3),
  q("linen-hamper"),
  q("treatment-cart"),
  q("waste-bin"),
];

export const soiledUtilitySetup: RecommendedAsset[] = [
  q("linen-hamper", 2),
  q("bedpan-washer"),
  q("waste-bin", 2),
  q("recycling-station"),
  q("sharps-container-holder"),
];

export const equipmentStorageSetup: RecommendedAsset[] = [
  q("storage-cabinet", 4),
  q("case-cart", 2),
  q("wheelchair", 2),
  q("stretcher"),
  q("waste-bin"),
];

export const biomedSetup: RecommendedAsset[] = [
  q("office-desk", 2),
  q("task-chair", 2),
  q("storage-cabinet", 3),
  q("monitor-arm"),
  q("waste-bin"),
  q("recycling-station"),
];

export const linenSetup: RecommendedAsset[] = [
  q("storage-cabinet", 4),
  q("linen-hamper", 4),
  q("waste-bin"),
];

export const kitchenSetup: RecommendedAsset[] = [
  q("commercial-dishwasher"),
  q("walk-in-refrigerator"),
  q("walk-in-freezer"),
  q("ice-machine"),
  q("kitchen-exhaust-hood", 2),
  q("storage-cabinet", 4),
  q("waste-bin", 2),
  q("recycling-station"),
];

export const laundrySetup: RecommendedAsset[] = [
  q("laundry-washer-extractor", 2),
  q("laundry-dryer", 2),
  q("linen-hamper", 4),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const wasteSetup: RecommendedAsset[] = [
  q("compactor"),
  q("waste-bin", 2),
  q("recycling-station", 2),
];

export const materialsSetup: RecommendedAsset[] = [
  q("office-desk", 2),
  q("task-chair", 2),
  q("storage-cabinet", 4),
  q("case-cart", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const centralMonitoringSetup: RecommendedAsset[] = [
  q("office-desk", 2),
  q("task-chair", 2),
  q("monitor-arm", 4),
  q("nurse-call-headend"),
  q("waste-bin"),
];

export const transportSetup: RecommendedAsset[] = [
  q("stretcher", 2),
  q("wheelchair", 4),
  q("oxygen-cylinder-cart", 2),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const breakRoomSetup: RecommendedAsset[] = [
  q("break-room-table", 2),
  q("break-room-chair", 6),
  q("lounge-sofa"),
  q("coffee-table"),
  q("storage-cabinet", 2),
  q("waste-bin"),
  q("recycling-station"),
];

export const onCallSetup: RecommendedAsset[] = [
  q("hospital-bed-electric"),
  q("bedside-cabinet"),
  q("patient-locker"),
  q("privacy-curtain"),
  q("office-desk"),
  q("task-chair"),
  q("waste-bin"),
];

export const lockerRoomSetup: RecommendedAsset[] = [
  q("lockers", 4),
  q("side-chair", 4),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const meetingSetup: RecommendedAsset[] = [
  q("meeting-table"),
  q("task-chair", 6),
  q("whiteboard"),
  q("monitor-arm"),
  q("waste-bin"),
];

export const officeSetup: RecommendedAsset[] = [
  q("office-desk"),
  q("task-chair"),
  q("guest-chair", 2),
  q("filing-cabinet"),
  q("bookshelf"),
  q("waste-bin"),
];

export const openOfficeSetup: RecommendedAsset[] = [
  q("office-desk", 8),
  q("task-chair", 8),
  q("monitor-arm", 8),
  q("cubicle-partition", 6),
  q("storage-cabinet", 4),
  q("printer-stand", 2),
  q("waste-bin", 4),
  q("recycling-station", 2),
];

export const recordsSetup: RecommendedAsset[] = [
  q("filing-cabinet", 6),
  q("storage-cabinet", 4),
  q("office-desk", 2),
  q("task-chair", 2),
  q("waste-bin"),
];

export const serverSetup: RecommendedAsset[] = [
  q("server-rack", 4),
  q("network-switch", 4),
  q("ups", 2),
  q("pacs-server"),
  q("waste-bin"),
];

export const securitySetup: RecommendedAsset[] = [
  q("office-desk"),
  q("task-chair", 2),
  q("monitor-arm", 4),
  q("cctv-recorder"),
  q("access-control-headend"),
  q("waste-bin"),
];

export const educationSetup: RecommendedAsset[] = [
  q("meeting-table", 2),
  q("task-chair", 12),
  q("whiteboard", 2),
  q("podium"),
  q("monitor-arm"),
  q("storage-cabinet", 2),
  q("waste-bin"),
];

export const mechanicalSetup: RecommendedAsset[] = [
  q("ahu", 2),
  q("chiller"),
  q("boiler"),
  q("steam-generator"),
  q("bms"),
  q("energy-meter", 2),
  q("waste-bin"),
];

export const electricalSetup: RecommendedAsset[] = [
  q("electrical-panel", 4),
  q("transformer", 2),
  q("automatic-transfer-switch", 2),
  q("energy-meter", 2),
];

export const generatorSetup: RecommendedAsset[] = [
  q("diesel-generator", 2),
  q("automatic-transfer-switch", 2),
  q("ups", 2),
  q("energy-meter"),
];

export const gasStorageSetup: RecommendedAsset[] = [
  q("oxygen-bulk-tank"),
  q("nitrous-oxide-manifold"),
  q("medical-gas-alarm-panel"),
  q("storage-cabinet"),
];

export const vacuumSetup: RecommendedAsset[] = [
  q("medical-vacuum-pump", 2),
  q("medical-air-compressor", 2),
  q("medical-gas-alarm-panel"),
  q("storage-cabinet"),
];

export const boilerSetup: RecommendedAsset[] = [
  q("boiler", 2),
  q("steam-generator"),
  q("water-softener", 2),
  q("bms"),
];

export const chillerSetup: RecommendedAsset[] = [
  q("chiller", 2),
  q("cooling-tower", 2),
  q("bms"),
  q("energy-meter", 2),
];

export const ahuSetup: RecommendedAsset[] = [
  q("ahu", 4),
  q("bms"),
  q("energy-meter", 2),
];

export const waterTreatmentSetup: RecommendedAsset[] = [
  q("ro-water-system", 2),
  q("water-softener", 2),
  q("storage-cabinet"),
];

export const upsSetup: RecommendedAsset[] = [
  q("ups", 4),
  q("electrical-panel", 2),
  q("bms"),
];

export const telecomSetup: RecommendedAsset[] = [
  q("pbx"),
  q("network-switch", 2),
  q("server-rack"),
  q("wifi-access-point", 2),
];

export const firePumpSetup: RecommendedAsset[] = [
  q("fire-pump", 2),
  q("fire-alarm-panel"),
  q("storage-cabinet"),
];

export const oxygenStorageSetup: RecommendedAsset[] = [
  q("oxygen-bulk-tank", 2),
  q("medical-gas-alarm-panel"),
  q("storage-cabinet"),
];

export const airPlantSetup: RecommendedAsset[] = [
  q("medical-air-compressor", 2),
  q("medical-vacuum-pump", 2),
  q("medical-gas-alarm-panel"),
  q("bms"),
];

export const tubeRoomSetup: RecommendedAsset[] = [
  q("pneumatic-tube-station", 2),
  q("storage-cabinet"),
];
