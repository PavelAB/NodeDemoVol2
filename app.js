// Configuration des variables d'environnement grace a dotenv
require('dotenv').config();



//Import du modeule Node "http" permettant de cree un server web
const http = require('http');
//Import du module url permettant de decouper notre req.url
const url=require('url');
//Import du module querystring permettant de parser les datasde notre post
const querystring=require('querystring');
//import du module ejs permettant generer du html
const ejs = require('ejs');
//Import du module path permettant de faciliter la generation du chemins
const path =require('path');
//Import du module file system pour gere les fichier
const fs=require('fs');


//Creation de serveur
const app = http.createServer((req,res)=>{
    //Recuperation des infos de la route (dans req)
    //console.log(req);
    //URL
    const requestUrl = url.parse(req.url).pathname;
    //query
    const requestQuery=url.parse(req.url).query;
    //method de la req (Post ou get)
    const requestMethod =req.method;

    console.log(requestUrl);
    console.log(requestQuery);
    console.log(req.method);

    //Gestion du dossier public et des differentes types de fichiers
    //Creation du path
    const filepublic= path.resolve('public'+requestUrl)
    console.log('Searching file :',filepublic);
    //si la route n'est pas "/" et si le fichier existe bien
    if(requestUrl!=='/' && fs.existsSync(filepublic))
    {
        //On lit le fichier 
        const file = fs.readFileSync(filepublic);
        //On recuperel'extension du fichier
        // console.log(file);
        const extension = path.extname(filepublic).replace('.','')
        console.log(extension);
        //selon l'extension : traitement
        let contentType='';
        if(['gif','png','jpeg','svg','bmp'].includes(extension)){
            contentType='image/'+extension;
        }else if(extension==='css')
        {   
            contentType='text/css';
        }
        res.writeHead(200,{
            "Content-type" : contentType
        })
        res.end(file)
        return;
    }


    //Definition des differents comportement en fct des routes et de la methode
    if(requestUrl==='/'&&requestMethod==='GET'){
        //Home page
        console.log("Bienvenue sur la home page");
        
        const today = new Date().toLocaleDateString('fr-be',{
            dateStyle:'long'
        }) 
        const trainers = [
            {firstname:'Aude',lastname:'Beurive'},
            {firstname:'Piere',lastname:'Santos'},
            {firstname:'Aurelien',lastname:'Strimelle'}
        ]
        
        //utilisation d'ejs pour rendre la vue
        //Generation du path

        const filename=path.resolve('views','home.ejs')

        //creation des datas a envoyer a la vue

        const data={ // on fournit un objet qui contient today et notre tab de formateurs
            today,
            trainers
        }
        //Rendu de la vue
        ejs.renderFile(filename,data, (error,render)=>{
            if(error)
            {
                console.log(error);
                return;
            }
            //envoi de la reponse (res -> reponse)
            //Contenant la "vue"
        res.writeHead(200,{"Content-type":"text/html"}) //On precise que on renvoi du html
        res.end(render);// on termine la requete en fournissant les donnees a afficher dans la reponse

        })


        
    }
    else if (requestUrl==='/contact'){
        if(requestMethod==='GET'){
            //contact page
            console.log("Bienvenue sur la Contact page");
            
            
            //Recuperation du chemin vers le fichier ejs
            const filename = path.resolve('views','contact.ejs')
            //Rendu ejs
            ejs.renderFile(filename,(err,render)=>{
                if(err){
                    console.log(err);
                    return;
                }
                console.log("Rendu de la page contact");
                res.writeHead(200,{
                    "Content-type": 'text/html'})
                res.end(render);
            })

            
        }
        else if(requestMethod==='POST'){
            //Recuperation du form contact
            //Recuperation des donnees du formulaire
            let data='';
            //event declenche a la reception des datas
            req.on('data',(form)=>{
                data += form.toString('utf8');
                console.log(data);
            })
            req.on('end',()=>{
                //traitememnt des donnees
                console.log('End : ',data);
                //Convertion des donnees
                
                const result=querystring.parse(data);
                console.log('Data after parsing : ',result);


                //traitement de la reponse (res)
                //Redirection vers la page de notre choix
                res.writeHead(301, {
                    "Location" : "/" //Renvoyer a la HomePage
                
                })
                res.end();
            })

        }
        
    }
    else if (requestUrl==='/about'){
        if(requestMethod==='GET'){
            //contact page
            console.log("Bienvenue sur la Contact page");
            const personnes = [
                {firstname:'A',lastname:'First',genre:'M',birthdate:new Date(1990,1,1),cours:["Math","Bio"]},
                {firstname:'B',lastname:'Second',genre:'F',birthdate:new Date(2000,2,2),cours:["Math","Chimie"]},
                {firstname:'C',lastname:'Third',genre:'F',birthdate:new Date(2010,3,3),cours:["Francais","Anglais"]}

            ]
            const data={ // on fournit un objet qui contient today et notre tab de formateurs
                personnes
            }
            
            //Recuperation du chemin vers le fichier ejs
            const filename = path.resolve('views','about.ejs')
            //Rendu ejs
            ejs.renderFile(filename,data,(err,render)=>{
                if(err){
                    console.log(err);
                    return;
                }
                console.log("Rendu de la page contact");
                res.writeHead(200,{
                    "Content-type": 'text/html'})
                res.end(render);
            })

            
        }
    }
    else{
        //route inexistante
        //Page404
        const filename=path.resolve('views','notfound.ejs');
        ejs.renderFile(filename,(err,render)=>{
            if(err){
                console.log(err);
                return;
            }
        res.writeHead(200,{
            "Content-type" :"text/html"
        })
        res.end(render);
        })
        
    }

})

// const{PORT,...} = process.env

//Lancement du serveur
app.listen(process.env.PORT,()=>{
    console.log(`Server started on port: ${process.env.PORT}`);
})