FROM hub.51hone.com/sre/nginx:1.22.1-bullseye-perl as usdh-vote-res
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
COPY usdh-vote/ /usr/share/nginx/html/
COPY server.conf /etc/nginx/conf.d/
RUN rm -f /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
