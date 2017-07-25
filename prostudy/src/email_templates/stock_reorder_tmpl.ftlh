<html>
  <p>Please find list of books with quantities below set threshold values in the attached CSV file.</p>

  <br>
  <p>Thanks and Regards,</p>  
  <p>${instituteName}</p>
  <p>${instituteAdressLine1}</p>
  <#if instituteAdressLine2??>
    <p>${instituteAdressLine2}</p>
  </#if> 
  <p>${instituteAdressCity} 
  		<#if instituteAdressPin??>,${instituteAdressPin} 
  		</#if>
  </p> 
  <p>${instituteAdressState} 
  		<#if instituteAdressCountry??>,${instituteAdressCountry} 
  		</#if>
  </p>

</html>