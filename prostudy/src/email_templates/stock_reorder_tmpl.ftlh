<html>
  <p>Please find below books with quantities below set threshold values in the attached CSV file.</p>

  <br>
  <p>Thanks and Regards,</p>  
  <p>${instituteName}</p>
  <p>${instituteAdressLine1}</p>
  <#if businessAdressLine2??>
    <p>${businessAdressLine2}</p>
  </#if> 
  <p>${businessAdressCity} 
  		<#if businessAdressPin??>,${businessAdressPin} 
  		</#if>
  </p> 
  <p>${businessAdressState} 
  		<#if businessAdressCountry??>,${businessAdressCountry} 
  		</#if>
  </p>

</html>