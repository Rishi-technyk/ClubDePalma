import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import RenderHTML from 'react-native-render-html'
import { FONT_FAMILY } from '../../util/constant';
const data = [
  {
    data: `<p><strong>Privacy Policy</strong></p>
<p>We respect your right to online privacy. When you register on this site or otherwise provide any personal information to us online, your personal information will only be used in conjunction with providing you with enhanced services related to the site. It will never be sold or shared with any third party. We may, for instance, contact you to offer assistance, provide information or otherwise help with your real estate search or sale. We may also provide you with enhanced services such as e-newsletter or instant alerts when homes that match your search criteria come on the market. You may opt-out of any communications at any time.</p>
<p>Anonymous Information</p>
<p>Like most sites on the Internet, we also collect anonymous data on how our visitors use our site for the purpose of calculating aggregate site statistics. This data reflects site usage patterns gathered during thousands of customer visits each month and does not contain any personally identifying information whatsoever. We reserve the right to share this anonymous data, provide log files and other databases of user information to third parties for analysis, and use this information to better understand client traffic and improve online services.<br />Questions</p>
<p>For more information about our privacy policy please don&rsquo;t hesitate to email us at&nbsp;<a href="mailto:contact@clubedepalma.in"><span class="list-content">contact@clubedepalma.in</span></a></p>
<!-- Comments are visible in the HTML source only -->`,
  },
  {
    data: `<p>These Terms and Conditions of Use Agreement (the &ldquo;Agreement&rdquo;) is between you and Clube de Palma Limited and sets forth the terms and conditions under which Clube de Palma Limited provides access to content and services at and through # (the &ldquo;Site&rdquo;).</p>
<ul>
<li><strong>ACCEPTANCE OF THE AGREEMENT</strong></li>
</ul>
<p>Your use of the Site and any services or Content (as defined below) available on or through the Site or through Clube de Palma, constitutes your acceptance, without modification, of the terms and conditions of this Agreement. By using the Site or any services provided by Clube de Palma, you represent and agree that you are eighteen (18) years of age or older, are of legal age and capacity to form a binding contract or have the permission and/or legal authorization of your parent or legal guardian to enter into this Agreement, and that you are not a person barred from entering into agreements in and receiving services from the Government of Law. If you do not agree with the terms and conditions of this Agreement, you agree not to access the Site or use the services provided by Clube de Palma. If you have any questions about this Agreement or the practices of this Site, do not use the site and please contact Clube de Palma at wd-envelope-light Email :&nbsp;</p>
<ul>
<li><strong>ADDITIONAL TERMS AND CONDITIONS</strong></li>
</ul>
<p>Certain features and services available on the Site may be subject to additional terms and conditions, including the payment of certain fees. All purchases of services are subject to the Clube de Palma Terms and Conditions of Services Agreement. Clube de Palma&acute;s collection and use of personal information that you may provide to Clube de Palma, or which may be collected from you by the Clube de Palma is governed by the Clube de Palma Privacy Policy which is expressly incorporated into this Agreement as if contained herein in its entirety.</p>
<ul>
<li><strong>AMENDMENT AND MODIFICATIONS TO AGREEMENTS</strong></li>
</ul>
<p>Clube de Palma may amend or make additions, deletions or modifications to this Agreement, the Clube de Palma Terms and Conditions of Services and Clube de Palma Privacy Policy at any time and without prior notice. Such amendments or modifications shall be effective upon posting the amended terms on the Site and/or e-mailing of such amendments or modifications to registered users of the Site, and you agree to be bound by such amendments or modifications for any future use of the Site or services provided by Clube de Palma after they are posted and/or e-mailed.</p>
<ul>
<li><strong>ACCOUNT MEMBERSHIP ELIGIBILITY</strong></li>
</ul>
<p>If you become a member or subscribe to any services offered on or through the Site, you agree to:</p>
<p>&ndash; Provide true, accurate, current and complete information about yourself and/or your company as prompted by the registration and order forms, and</p>
<p>&ndash; To maintain and update this information to keep it true, accurate, current and complete. If any information provided by you is untrue, inaccurate, not current or incomplete, Clube de Palma reserves the right to terminate your account and refuse any and all current or future use of the Site and affiliated services. You are solely responsible for choosing and keeping secure your password to access your account on the Site. Clube de Palma bears no responsibility for your account being compromised and used without your authorization. Should you become aware of unauthorized activity on your account, you agree to notify Clube de Palma immediately. You further agree not to share user names or passwords, which is expressly prohibited, unless authorized in writing by Clube de Palma. You further agree not to reverse engineer, hack, spam, block, disrupt, or otherwise change or alter, or attempt to change or alter, the Site.</p>
<ul>
<li><strong>CHILDREN UNDER 18</strong></li>
</ul>
<p>Clube de Palma does not knowingly collect or solicit personal information from anyone under the age of 18 or knowingly allow such persons to register with Clube de Palma. If you are under 18, please do not send any information to us, including your name, address, telephone number, or email address. No one under age 18 is allowed to provide any personal information to Clube de Palma or be a user of Clube de Palma services. In the event that we learn that we have collected personal information from a child under age 18 without verification of parental consent, we will delete that information as quickly as possible. If you believe that we might have any information from or about a child under 18, please contact us at wd-envelope-light.</p>
<ul>
<li><strong>USER CONDUCT</strong></li>
</ul>
<p>You understand that the services provided by Clube de Palma are available for your personal, non-commercial use only. You represent, warrant and agree that no materials of any kind submitted through your Clube de Palma account will violate or infringe upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary rights; or contain libelous, defamatory or otherwise unlawful material. You further agree that you may not use the services provided by Clube de Palma or the Site in any unlawful manner or in any other manner that could damage, disable, overburden or impair the Site.</p>
<p>&ndash;  In addition, you agree not to use the services provided by Clube de Palma or the Site to:</p>
<p>&ndash; Upload, post, email, transmit or otherwise make available any content that Clube de Palma, in its sole discretion, deems to be harmful, threatening, abusive, harassing, vulgar, obscene, or hateful, or is racially, ethnically, religiously, or otherwise offensive;</p>
<p>&ndash; Engage in any activities in violation of any applicable local, state, national, regional, or international law, rules, or regulations;</p>
<p>&ndash; Transmit any material that infringes any copyright, patent, trade secret, or other proprietary or privacy right of any third party;</p>
<p>&ndash; Impersonate any person or entity, or falsely state or otherwise misrepresent yourself or your affiliation with any person or entity;</p>
<p>&ndash; Upload, post, email, transmit or otherwise make available any unsolicited or unauthorized advertising, promotional materials, &ldquo;junk mail,&rdquo; &ldquo;spam,&rdquo; &ldquo;chain letters,&rdquo; &ldquo;pyramid schemes,&rdquo; or any other form of commercial solicitation;</p>
<p>&ndash; Upload, post, email, transmit or otherwise make available any material that contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment;</p>
<p>&ndash; Intimidate or harass another; or</p>
<p>&ndash; Use or attempt to use another&acute;s account, service or system without authorization from Clube de Palma, or create a false identity on the Site.</p>
<p>Clube de Palma may terminate your ability to access the Site or use the services provided by Clube de Palma at any time and for any reason in its sole discretion. Clube de Palma reserves the right at any time from time to time and without notice to modify or discontinue, temporarily or permanently, the Site or the services it provides. You agree that Clube de Palma shall not be liable to you or to any third party for any modification, suspension, or discontinuation of the Site or the services.</p>
<p>If Clube de Palma identifies that you are using the Site for commercial use, Clube de Palma may seek to be reimbursed for any and all costs and expenses related to your usage of the Site, including reasonable attorneys fees arising from your breach of this Agreement.</p>
<ul>
<li><strong>OWNERSHIP AND COPYRIGHT AND TRADEMARK NOTICE</strong></li>
</ul>
<p>This Site is owned and operated by Clube de Palma doing business as Clube de Palma. All content, information and materials appearing on this Site, including, without limitation, text, site design, logos, graphics, icons, images, and voice, video, and sound clips, as well as, the selection, assembly and arrangement thereof (&ldquo;Content&rdquo;) are the sole property of Clube de Palma or its licensors and are protected by International copyright, patent and trademark laws and treaties. Clube de Palma and its licensors expressly reserve all rights in and to such Content. You may use the Content contained on this Site and the services offered through this Site only for your own personal purposes. No Content from this Site may be copied, reproduced, modified, republished, uploaded, posted, transmitted, or distributed in any form or by any means without Clube de Palma&acute;s or its licensor&acute;s prior written permission except as explicitly permitted in this Agreement.</p>
<p>All content, information, and materials you upload to the Site or provide to Clube de Palma using the services offered by Clube de Palma, including, without limitation, text, graphics, icons, images, and voice, video, and sound clips shall become the property of Clube de Palma immediately upon their upload or transmission and you hereby assign and agree to assign all rights in such materials to Clube de Palma. Clube de Palma may store, delete, retain, or dispose of such materials in its sole discretion and shall be under no obligation to retain such materials for any particular period of time.</p>
<p>All software used on the Site, to provide services through the Site, and to operate the Site is the sole property of Clube de Palma or its licensors and may not be used elsewhere without prior written permission. Certain patents, trademarks, copyrights and other content or proprietary information used on this Site may be owned by third parties not affiliated with Clube de Palma and are being used under license and with permission by Clube de Palma under various agreements.</p>
<ul>
<li><strong>UNSOLICITED IDEAS</strong></li>
</ul>
<p>Clube de Palma welcomes your comments and feedback about the site or about its services; however, Clube de Palma, in its sole discretion, reserves the right to use or not use any ideas, content, materials, or suggestions you submit without any express or implied obligation, contract or compensation to you. all ideas, materials, or suggestions (including, without limitation, unsolicited ideas, suggestions, or materials) submitted shall become the property of Clube de Palma and Clube de Palma may use such ideas, materials, or suggestions in whole or in part at Clube de Palma&acute;s sole discretion without compensation or credit to you.</p>
<ul>
<li><strong>INDEMNIFICATION</strong></li>
</ul>
<p>You agree to defend, indemnify and hold harmless Clube de Palma and its subsidiaries, affiliates, related companies, employees, officers, directors, agents, telecommunications providers, and content providers from all claims, demands, liabilities, costs, and expenses, including reasonable attorneys&acute; fees, arising from your breach of this Agreement, your violation of the rights of any third parties using the services provided by Clube de Palma or the Site, or your violation of any federal, state, local or other applicable laws, rules, or regulations using the service provided by Clube de Palma or the Site.</p>
<ul>
<li><strong>SECURITY</strong></li>
</ul>
<p>Clube de Palma takes steps to ensure that all information collected is treated securely and in accordance with this Agreement and the Clube de Palma Privacy Policy. Unfortunately, no data transmission over the Internet or telephone can be guaranteed to be 100% secure. Accordingly, Clube de Palma cannot ensure or warrant the security of any information you transmit to Clube de Palma. Therefore, any transmission of information by you to Clube de Palma is done at your own risk. When Clube de Palma receives your transmission, Clube de Palma makes commercially reasonable efforts to ensure the security of your information on our systems.</p>
<ul>
<li><strong>JURISDICTION, VENUE, AND NOTICES</strong></li>
</ul>
<p>All legal disputes arising from or relating to the Site, your access and/or use of the Site, this Agreement, the Clube de Palma Privacy Policy, and the Clube de Palma Terms and Conditions of Services Agreement shall be settled under the laws of Indian courts subject to laws of Republic of India. In the event of any dispute of whatever nature, such dispute shall be settled in good faith between the parties. In case, such dispute cannot be resolved by negotiation within 30 days, such dispute shall be referred to a binding arbitration in accordance with the provisions of the Arbitration and Conciliation Act 1996. The place of arbitration shall be Clube de Palma, India. In case of the dispute requiring intervention of courts, courts in Clube de Palma, India alone shall have exclusive jurisdiction.</p>
<p>You agree that the exclusive jurisdiction and venue for any litigation be an appropriate court located in Clube de Palma, India and you irrevocably consent to the exclusive jurisdiction and venue of such courts. If either party files suit or engages in other legal process to enforce the terms and conditions of this Agreement or the Clube de Palma Terms and Conditions of Services Agreement, or to collect monies owed by reason of this Agreement or the Clube de Palma Terms and Conditions of Services Agreement, the prevailing party in any such litigation shall be entitled to recover its reasonable attorneys fees and costs in connection with such enforcement efforts. You agree that Clube de Palma may provide notices relating to this Agreement, the Clube de Palma Privacy Policy, and the Clube de Palma Terms and Conditions of Services Agreement to you, including those regarding changes, by e-mail, regular, mail, and/or postings to the Site.</p>
<ul>
<li><strong>ENTIRE AGREEMENT</strong></li>
</ul>
<p>The Agreement and the Clube de Palma Privacy Policy constitutes the entire agreement between you and Clube de Palma and governs your use of the Site and the services provided by Clube de Palma, superseding any prior agreements between you and Clube de Palma with respect to the Site and the services provided by Clube de Palma. You also may be subject to additional terms and conditions that may apply when you use or purchase certain other Clube de Palma services, affiliate services and third-party content using the Site.</p>
<ul>
<li><strong>WAIVER AND SEVERABILITY</strong></li>
</ul>
<p>The failure of Clube de Palma to exercise or enforce any right or provision of this Agreement shall not constitute a waiver of such right or provision. If any provision of this Agreement is found by a court of competent jurisdiction to be invalid, the parties agree that the court should endeavor to give effect to the parties. Intentions as reflected in the provision and the other provisions of this Agreement shall remain in full force and effect.</p>`,
  },
  {
    data: `<p>The information contained and transmitted through the Website is proprietary to Clube de Palma. And is intended solely for the members of the club may contain information that is privileged, confidential or exempt from disclosure under applicable law.</p>
<p>Access to this website and/or attachments by anyone else is unauthorized. If you are not a member of the Club, an agent of a Member or a person responsible for delivering the information to the member of the club, you are notified that any use, distribution, transmission, printing, copying or dissemination of this information in any way or in any manner is strictly prohibited.</p>
<p>There is no guarantee that the integrity of this website has been maintained and nor is this site free of viruses, interceptions or interference.</p>
<!-- Comments are visible in the HTML source only -->`,
  },
  {
    data: `<div class="main-page-wrapper">
<div class="container">
<div class="row content-layout-wrapper align-items-start">
<div class="site-content col-lg-12 col-12 col-md-12">
<article id="post-9214" class="post-9214 page type-page status-publish hentry">
<div class="entry-content">
<div class="elementor elementor-9214" data-elementor-type="wp-page" data-elementor-id="9214">
<section class="elementor-section elementor-top-section elementor-element elementor-element-76c7f6b elementor-section-boxed elementor-section-height-default elementor-section-height-default wd-section-disabled" data-id="76c7f6b" data-element_type="section">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-525488a" data-id="525488a" data-element_type="column">
<div class="elementor-widget-wrap elementor-element-populated">
<div class="elementor-element elementor-element-d0d88b1 color-scheme-inherit text-left elementor-widget elementor-widget-text-editor" data-id="d0d88b1" data-element_type="widget" data-widget_type="text-editor.default">
<div class="elementor-widget-container">
<h5>1. 100% advance is to be paid at the time of booking of party.</h5>
<h5>2. Mode of payment:</h5>
<p>(a) Debit Card, Credit Card, Net Banking, UPI.</p>
<p>(b) Cheque payable at par at New Delhi.</p>
<p>(c) Online Payment from https://dynamixclubedepalma.co.in/</p>
<h5>3. Cancellation and Refund :</h5>
<h5>4. Charges of Cancellation are as under :</h5>
<p>(a) Cancellation with less than 48 hours &ndash; 100% of actual rent</p>
<p>(b) Cancellation between 49-96 hours &ndash; 50% of actual rent</p>
<p>(c) Cancellation between 4-9 days &ndash; 20% of actual rent</p>
<p>(d) Cancellation with 10 days in advance &ndash; NIL</p>
<h5>5. Refund Policy</h5>
<p>If desired by the member the refund if any, will be made through a New Delhi cheque payable at all branches of the Drawer Bank. However a Members can lease the amount as a credit to be utilized later,also transfer balance amount to the membership or his/her bank account.</p>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</div>
</article>
</div>
</div>
</div>
</div>
<div class="wd-prefooter">&nbsp;</div>
<footer class="footer-container color-scheme-light">
<div class="container main-footer">&nbsp;</div>
</footer><!-- Comments are visible in the HTML source only -->`,
  },
  {
    data: `<p><img src="https://dynamixclubedepalma.co.in/wp-content/uploads/2024/11/bg.webp" alt="Clube de Pamla" width="1520" height="659" /><br/>The revered sanctity of a Member&rsquo;s Club lies in the unspoken relationships forged within its walls; the shared experiences blossoming into lasting bonds. It is the growing familiarity between two polite smiles, the fierce competition volleyed over a net, or the plate of chips shared after a swim. Amidst the sway of palms and the cool sea breeze, Clube de Palma is a promise of 40,000 sq.ft. of recreational bliss, welcoming individuals to build a beautiful community in the shade and vibrance of the Konkan Coast.</p>
<p>With an array of activities, amenities, and services at one&rsquo;s fingertips, Clube de Palma will be one of Goa&rsquo;s largest, and most expansive club experiences yet. And the keys to the kingdom, well they lie with only you, the esteemed residents of Aldeia de Goa.</p>`,
  },
];
const { height, width } = Dimensions.get("window");
const Info = ({ route }) => {
    console.log(route.params.index);
  return (
    <View style={{flex:1}}>
      <Header title={route.params.name} />
      <ScrollView style={{}}>
        <RenderHTML
          source={{
            html: data[route.params.index]?.data,
          }}
          enableUserAgentStyles={true}
                  contentWidth={width - 40}
                   baseStyle={{ 
                    fontFamily: FONT_FAMILY.normal ,
                    color:'black',
                  textAlign:'auto',
                    margin:20,
                  flex:1
                  }}
        />
      </ScrollView>
    </View>
  );
}

export default Info

const styles = StyleSheet.create({})