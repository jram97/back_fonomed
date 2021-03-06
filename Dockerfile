FROM node:latest

RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN ln -fs /usr/share/zoneinfo/America/El_Salvador /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata

WORKDIR /usr/src/app 

RUN NODE_OPTIONS=--max_old_space_size=4096

COPY package*.json ./ 

RUN  npm install 

COPY . .  

RUN npm run build 
EXPOSE 3000    

CMD ["npm","start"]


