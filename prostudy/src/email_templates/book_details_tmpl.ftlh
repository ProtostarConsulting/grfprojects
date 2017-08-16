<html>
<style type="text/css">
table {
	border-collapse: collapse;
	font-size:11px;
}

th {
	border: 1px solid black; 
	border-spacing: 5px; 
	height: 20px; 
	padding: 7px;
}

td {
	border: 1px solid black;
	border-spacing: 5px; 
	height: 15px; 
	padding: 5px;
}

 table.one, td.one {
 	border: none;
 }
 

</style>
  <p align="center">${instituteName}</p>
  <p align="center">${gvspName}</p>
  <br></br>
  <p style="font-size:11px;"><b>Reg. No.:</b> ${regNo}</p>
  <p style="font-size:11px;"><b>School Name:</b> ${schoolName}</p>
  <p style="font-size:11px;"><b>At. address:</b> ${city}</p>
  <br></br>
  <#if bookDetailList??>
  <table border="1"
	style="width: 100%; height: 100%; ">
	<caption align="left" style="border-spacing: 5px;padding: 3px;"><b>Book Details: </b></caption>
	<tbody>

		<tr>
			<th>Standard </th>
			<th>Book Name</th>
			<th>Qty.</th>
			<th>Book Price</th>
			<th>Book Amount</th>
			<th>Exam Fees</th>
			<th>GRF Total</th>
		</tr>
		
		<#list bookDetailList as bookDetails>	
			<tr>
			<td>${bookDetails.standard}</td>
			<td>${bookDetails.bookName}</td>
			<td align="right">${bookDetails.totalStud}</td>			
			<td align="right">${bookDetails.bookPrise}</td>
			<td align="right">${bookDetails.totalFees}</td>
			<td align="right">${bookDetails.examFees}</td>
			<td align="right">${bookDetails.totalExamFees}</td>
		</tr>
		</#list>
		<tr>
		<td colspan="2" align="center">Total A</td>
		<td align="right">${totalStudent}</td>
		<td></td>
		<td align="right">${totalBookAmount}</td>
		<td></td>
		<td align="right">${totalGRFFees}</td>
		</tr>
		<tr>
		<td colspan="2" align="center">20% Expensess</td>
		<td></td>
		<td></td>
		<td align="right">${bookAmt20per}</td>
		<td></td>
		<td align="right">${examAmt20per}</td>
		</tr>
		<tr>
		<td colspan="2" align="center">Grand Total</td>
		<td></td>
		<td></td>
		<td align="right">${bookAmt80per}</td>
		<td></td>
		<td align="right">${examAmt80per}</td>
		</tr>	
		</tbody>
		</table>
		</#if>
	<br></br>
		<#if paymentDetailList??>
		<caption align="left" style="border-spacing: 5px;padding: 3px; font-size:11px;"><b>Payment Details: </b></caption>		
		<#list paymentDetailList as paymentDetail>
			<#if paymentDetail.payReceivedBy == 'D.D '>	
			<p style="font-size:11px; text-align: left;"><b>D.D No.:</b> ${paymentDetail.transactionNumber}</p>
  			<p style="font-size:11px; text-align: left;"><b>Bank Name:</b> ${paymentDetail.ddBankName}</p>
  			<p style="font-size:11px; text-align: left;"><b>Branch:</b> ${paymentDetail.ddBranchName}</p>
  			<p style="font-size:11px; text-align: left;"><b>D.D Date:</b> ${ddDate}</p>			
			</#if>
			
			<p style="font-size:11px; text-align: left;"><b>Deposit in</b> ${paymentDetail.nameOfBank}</p>
  			<p style="font-size:11px; text-align: left;"><b>Branch</b> ${paymentDetail.branchName}</p>
  			<p style="font-size:11px; text-align: left;"><b>Amt. Rs.</b> ${paymentDetail.payAmount}</p>
  			<p style="font-size:11px; text-align: left;"><b>Deposit Date:</b> ${depositDate}</p>
  			
		</#list>
		</#if>	
</html>