<html>
<head>
    <title></title>
    <link href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>
    <link href="../../app.css" rel="stylesheet" >
</head>
<body>
    <nav class="navbar navbar-default">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="../../index.html"><img class="logo" src="https://www.docker.com/sites/all/themes/docker/assets/images/brand-full.svg" alt="Docker" title="Docker"/></a>
        </div>
    </div><!-- /.container-fluid -->
    </nav>
    <div class="container">
    <div class="row">
        <h1></h1>
        <div class="content">
            <h1 id="containerizing-an-application">Containerizing an Application</h1>
<p>In this exercise, you&#39;ll be provided with the application logic of a simple three tier application; your job will be to write Dockerfiles to containerize each tier, and write a Docker Compose file to orchestrate the deployment of that app. This application serves a website that presents cat gifs pulled from a database. The tiers are as follows:</p>
<ul>
<li><strong>Database</strong>: Postgres 9.6</li>
<li><strong>API</strong>: Java SpringBoot built via Maven</li>
<li><strong>Frontend</strong>: NodeJS + Express</li>
</ul>
<p>Basic success means writing the Dockerfiles and docker-compose file needed to deploy this application to your orchestrator of choice; to go beyond this, think about minimizing image size, maximizing image performance, and making good choices regarding configuration management.</p>
<p>Start by cloning the source code for this app:</p>
<pre><code class="lang-bash">$ git clone -b ee2.0 https://github.com/docker-training/fundamentals-final.git
</code></pre>
<h2 id="containerizing-the-database">Containerizing the Database</h2>
<ol>
<li><p>Navigate to <code>fundamentals-final/database</code> to find the config for your database tier.</p>
</li>
<li><p>Begin writing a Dockerfile for your postgres database image by choosing an appropriate base image.</p>
</li>
<li><p>Your developers have provided you with postgres configuration files <code>pg_hba.conf</code> and <code>postgresql.conf</code>. Both of these need to be present in <code>/usr/share/postgresql/9.6/</code>.</p>
</li>
<li><p>You have also been provided with <code>init-db.sql</code>. This SQL script populates your database with the required cat gifs. Read the docs for Postgres and / or your base image to determine how to run this script.</p>
</li>
<li><p>Postgres expects the environment variables <code>POSTGRES_USER</code> and <code>POSTGRES_DB</code> to be set at runtime. Make sure these are set to <code>gordonuser</code> and <code>ddev</code>, respectively, when your database container is running.</p>
</li>
<li><p>Once you&#39;ve built your image, try running it, connecting to it, and querying the postgres database to make sure it&#39;s up and running as you&#39;d expect:</p>
<pre><code class="lang-bash">$ docker container run --name database -d mydb:latest
$ docker container exec -it database bash
$ psql ddev gordonuser -c &#39;select * from images;&#39;
</code></pre>
<p>If everything is working correctly, you should see a table with URLs to cat gifs returned by the query. Exit and delete this container once you&#39;re satisfied that it is working correctly.</p>
</li>
</ol>
<h2 id="containerizing-the-api">Containerizing the API</h2>
<ol>
<li><p>Navigate to <code>fundamentals-final/api</code> to find the source and config for your api tier.</p>
</li>
<li><p>We intend to build this SpringBoot API with Maven. Begin writing a Dockerfile for your API by choosing an appropriate base image for your <strong>build</strong> environment.</p>
</li>
<li><p>Your developers gave you the following pieces of information:</p>
<ul>
<li>Everything Maven needs to build our API is in <code>fundamentals-final/api</code>.</li>
<li><p>The Maven commands to build your API are:</p>
<pre><code class="lang-bash">$ mvn -B -f pom.xml -s /usr/share/maven/ref/settings-docker.xml dependency:resolve
$ mvn -B -s /usr/share/maven/ref/settings-docker.xml package -DskipTests
</code></pre>
</li>
<li><p>This will produce a jar file <code>target/ddev-0.0.1-SNAPSHOT.jar</code> at the path where you ran Maven.</p>
</li>
<li><p>In order to successfully access Postgres, the <strong>execution</strong> environment for your API should be based on Java 8 in an alpine environemnt, and have the user <code>gordon</code>, as per:</p>
<pre><code class="lang-bash">$ adduser -Dh /home/gordon gordon
</code></pre>
</li>
<li><p>The correct command to launch your API after it&#39;s built is:</p>
<pre><code class="lang-bash">$ java -jar &lt;path to jar file&gt;/ddev-0.0.1-SNAPSHOT.jar \
    --spring.profiles.active=postgres
</code></pre>
</li>
</ul>
<p>Use this information to finish writing your API Dockerfile. Mind your image size, and think about what components need to be present in production.</p>
</li>
<li><p>Once you&#39;ve built your API image, set up a simple integration test between your database and api by creating a container for each, attached to a network:</p>
<pre><code class="lang-bash">$ docker network create demo_net
$ docker container run -d --network demo_net --name database mydb:latest
$ docker container run -d --network demo_net -p 8080:8080 --name api myapi:latest
</code></pre>
</li>
<li><p>Curl an API endpoint:</p>
<pre><code class="lang-bash">$ curl localhost:8080/api/pet
</code></pre>
<p>If everything is working correctly, you should see a JSON response containing one of the cat gif URLs from the database. Leave this integration environment running for now.</p>
</li>
</ol>
<h2 id="containerizing-the-frontend">Containerizing the Frontend</h2>
<ol>
<li><p>Navigate to <code>fundamentals-final/ui</code> to find the source and config for your web frontend.</p>
</li>
<li><p>You know the following about setting up this frontend:</p>
<ul>
<li>It&#39;s a node application.</li>
<li>The filesystem structure under <code>fundamentals-final/ui</code> is exactly as it should be in the frontend&#39;s running environment.</li>
<li>Install proceeds by running <code>npm install</code> in the same directory as <code>package.json</code>.</li>
<li>The frontend is started by running <code>node src/server.js</code>.</li>
</ul>
<p>Write a Dockerfile that makes an appropriate environment, installs the frontend and starts it on container launch.</p>
</li>
<li><p>Once you&#39;ve built your ui image, start a container based on it, and attach it to your integration environment from the last step. Check to see if you can hit your website in your browser at <code>IP:port/pet</code>; if so, you have successfully containerized all three tiers of your application.</p>
</li>
</ol>
<h2 id="orchestrating-the-application">Orchestrating the Application</h2>
<p>Once all three elements of the application are containerized, it&#39;s time to assemble them into a functioning application by writing a Docker compose file. The environmental requirements for each service are as follows:</p>
<ul>
<li><strong>Database</strong>:<ul>
<li>Named <code>database</code>.</li>
<li>Make sure the environment variables <code>POSTGRES_USER</code> and <code>POSTGRES_DB</code> are set in the compose file, if they weren&#39;t set in the database&#39;s Dockerfile (when would you want to set them in one place versus the other?).</li>
<li>The database will need to communicate with the API.</li>
</ul>
</li>
<li><strong>API</strong>:<ul>
<li>Named <code>api</code>.</li>
<li>The API needs to communicate with both the database and the web frontend.</li>
</ul>
</li>
<li><strong>Frontend</strong>:<ul>
<li>Named <code>ui</code>.</li>
<li>Serves the web frontend on container port 3000.</li>
<li>Needs to be able to communicate with the API.</li>
</ul>
</li>
</ul>
<p>Write a <code>docker-compose.yml</code> to capture this configuration, and use it to stand up your app with Docker Compose, Swarm, or Kubernetes. Make sure the website is reachable from the browser.</p>
<h2 id="conclusion">Conclusion</h2>
<p>In this exercise, you containerized and orchestrated a simple three tier application by writing a Dockerfile for each service, and a Docker Compose file for the full application. In practice, developers should be including their Dockerfiles with their source code, and senior developers and / or application architects should be providing Docker Compose files for the full application, possibly in conjunction with the operations team for environment-specific config.</p>
<p>Compare your Dockerfiles and Docker Compose file with other people in the class; how do your solutions differ? What are the possible advantages of each approach?</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>