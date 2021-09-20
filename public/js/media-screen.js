const m350px = window.matchMedia('(max-width: 350px)');
const m351px_m550px = window.matchMedia('(min-width: 351px) and (max-width: 580px)');
const m551px_m850px = window.matchMedia('(min-width: 551px) and (max-width: 850px)');
const m851px_m1000px = window.matchMedia('(min-width: 851px) and (max-width: 1000px)');
const m1001px_m1200px = window.matchMedia('(min-width: 1001px) and (max-width: 1200px)');

const navbar = document.querySelector('.navbar');
const navbar_brand = document.querySelector('.navbar .container-fluid img');
const inputConvertDOM = document.querySelector('.updateInputDOM');
const download_buttons = document.querySelectorAll('.download-buttons');
(function(){
   checkResolution();
})();


window.addEventListener('resize',()=>{
   checkResolution();
});
function checkResolution() {   
    if($(window).width() < 660){
        inputConvertDOM.innerHTML = `
                <input type="text" class="form-control col" id="videoURL" placeholder="Enter Youtube URL here..." aria-label="Enter Youtube URL here..." aria-describedby="basic-addon2">
                <br>
                <button id="get-video-info-btn" class="col btn btn-primary btn-block" type="button" data-loading-text="<i class='fa fa-spinner fa-spin '></i> Converting.."><i class='fas fa-exchange-alt'></i>  Convert</button>
      
        `;
    }
    else{
        inputConvertDOM.innerHTML = `
                                            <div class="input-group mb-3">
                                            <input type="text" class="form-control" id="videoURL" placeholder="Enter Youtube URL here..." aria-label="Enter Youtube URL here..." aria-describedby="basic-addon2">
                                            <div class="input-group-append">
                                                <button id="get-video-info-btn" class="col btn btn-primary btn-block" type="button" data-loading-text="<i class='fa fa-spinner fa-spin '></i> Converting.."><i class='fas fa-exchange-alt'></i>  Convert</button>
      
                                            </div>
                                            </div>
        `;
    }

    try {
        // Chrome & Firefox
        if(m350px.matches){
            download_buttons.forEach((node)=>{
                node.innerHTML = `
                                <i class="fa fa-download" aria-hidden="true"></i></button>
                `;
            });

        }
        else{
            download_buttons.forEach((node)=>{
                node.innerHTML = `
                                <i class="fa fa-download" aria-hidden="true"></i> Download</button>
                `;
            });
        }

        // logo551px.addEventListener('change', (e) => {
        //     alert("LOGO 551px")
        //     navbar_brand.src = 'images/logo.png';
        // });    
      } catch (e1) {
          console.log("ERROR CONVERTING RESOLUTION!")
        // try {
        //   // Safari
        // //   m350px.addListener((e) => {
        // //     this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
        // //   });
        // } catch (e2) {
        //   console.error(e2);
        // }
      }
 } 
 
 