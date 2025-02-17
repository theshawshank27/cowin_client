	/**
	 * @description This piece of software makes use of  Cowin Public APIs released by Govt. of India. https://apisetu.gov.in/public/api/cowin
	 * @functionality
	 *    Given the district code/pin code  and date, the script searches for slot availabilty automatically in intervals (set to 7 secs by default).
	 *    On slot availabilty, the same will be displayed immediately on the console, with a beep sound.
	 *    The user should already be ready in the booking page to quickly book the available slots.
	 *
	 *
	 */



	/*****READ**** Instrutions for Users :
	 * @instructions
	 * 1.  Only change your inputs as per requirement in the `USER INPUTS` section below. Search by district code and PIN code is currently available.
     * 2.  Copy the whole script and paste in your Chrome/Firefox browser, press Enter. The script will start running and checking for slots.
	 * 3.  Keep yourself logged in to cowin during the process and in the slot booking page.
	 *
	 *
	 * /


	/******USER INPUTS********/

	var districtCode = 717;         //The district code you want to search for. (717 : Darjeeling)
	var date = "04-06-2021";        //The date from which you want to search for. The API automatically checks for the next 7 days
	var vaccine = "COVISHIELD";     //Possible values can be COVISHIELD , COVAXIN .
	//var fee_type = "Paid";        //Paid or Free
	var min_age_limit = 18;         //18 or 45
    var dose = 2;                   //dose1 and dose2
    var pincode = 560078            //pincode of your area (Bangalore JP nagar: 560078)
    var search_mode = "PIN"         //possible values can be PIN or any string which is taken as district .

	/******USER INPUTS********/


	/**
	 * @author SouravGhosh
	 * @date 1 June, 2021
	 */


	/******Source Code*********/

	var requestCOWIN = async (cowinAPIURL) => {
		const response = await fetch(cowinAPIURL,{
			headers: {
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
			}
		});
		if (response.status >= 200 && response.status <= 299) {
			return await response.json();
		} else {
			// Error handling block
			return new Error('API call failed');
		}
	}

	async function checkForAvailableVaccineSlots() {
	      console.log((_count++)+". Checking for available vaccine slots ...");
	        if(search_mode === "PIN" ){
	            url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincode+"&date="+date;
	        }else{
	            url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+districtCode+"&date="+date;
	        }
		  try {
				a = await requestCOWIN(url);
				for (c in a.centers) {
					for (s in a.centers[c].sessions) {
						//This if condition can be changed based on specific requirements
						//To make it more user-friendly
						if(a.centers[c].sessions[s].min_age_limit == min_age_limit){
						    if(a.centers[c].sessions[s].vaccine === vaccine){
                                if (a.centers[c].sessions[s].available_capacity > 0) {
                                    console.log("Available Slots : "+ a.centers[c].sessions[s].available_capacity);
                                    if(dose == 1 && a.centers[c].sessions[s].available_capacity_dose1 > 0 || dose == 2 && a.centers[c].sessions[s].available_capacity_dose2 > 0 ){
                                            var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                                            audio.play();
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                            console.log("Center :", a.centers[c].pincode, a.centers[c].name);
                                            console.log("Available Dose 1 Slots : "+ a.centers[c].sessions[s].available_capacity_dose1);
                                            console.log("Available Dose 2 Slots : "+ a.centers[c].sessions[s].available_capacity_dose2);
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                    }
                                }
                        	}
						}
					}
				}
		  } catch(e) {
			//ignoring exceptions for now
		  }
	  	  await addDelay(7000);
		  checkForAvailableVaccineSlots();
	}

	var _count = 1;
	var addDelay = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
	checkForAvailableVaccineSlots();
