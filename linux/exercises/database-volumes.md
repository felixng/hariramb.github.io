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
            <h1 id="database-volumes">Database Volumes</h1>
<p>Many popular databases containerize their runtimes, but push stateful information and database contents out to a volume. In this exercise we&#39;ll explore how this works for Postgres.</p>
<h2 id="launching-postgres">Launching Postgres</h2>
<ol>
<li><p>Download a postgres image, and look at its history to determine its default volume usage:</p>
<pre><code class="lang-bash">$ docker image pull postgres:9-alpine
$ docker image history --no-trunc postgres:9-alpine
</code></pre>
<p>You should see a line that contains something like <code>VOLUME [/var/lib/postgresql/data]</code>, indicating that that directory inside the container&#39;s filesystem will have a volume mounted to it automatically when a container is created from this image.</p>
</li>
<li><p>Set up a running instance of this postgres container:</p>
<pre><code class="lang-bash">$ docker container run --name some-postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -v db_backing:/var/lib/postgresql/data \
    -d postgres:9-alpine
</code></pre>
<p>Notice the explicit volume mount, <code>-v db_backing:/var/lib/postgresql/data</code>; if we hadn&#39;t done this, a randomly named volume would have been mounted to the container&#39;s <code>/var/lib/postgresql/data</code>. Naming the volume explicitly is a best practice that will become useful when we start mounting this volume in multiple containers.</p>
</li>
</ol>
<h2 id="writing-to-the-database">Writing to the Database</h2>
<ol>
<li><p>Launch a container that will provide an interactive postgres terminal:</p>
<pre><code class="lang-bash">$ docker container run -it --rm --link some-postgres:postgres \
    postgres:9-alpine psql -h postgres -U postgres
</code></pre>
<p>You&#39;ll need to provide the password you defined above (<code>mysecretpassword</code> by default). You&#39;ll be presented with a postgres terminal where you can execute SQL commands directly.</p>
</li>
<li><p>Create an arbitrary table in the database:</p>
<pre><code class="lang-bash">CREATE TABLE CATICECREAM(COAT TEXT, ICECREAM TEXT);
INSERT INTO CATICECREAM VALUES(&#39;calico&#39;, &#39;strawberry&#39;);
INSERT INTO CATICECREAM VALUES(&#39;tabby&#39;, &#39;lemon&#39;);
</code></pre>
<p>Double check you created the table you expected, and then quit this container:</p>
<pre><code class="lang-bash">SELECT * FROM CATICECREAM;
\q
</code></pre>
</li>
<li><p>Delete the postgres container:</p>
<pre><code class="lang-bash">$ docker container rm -f some-postgres
</code></pre>
</li>
<li><p>Create a new postgres container, mounting the <code>db_backing</code> volume just like last time:</p>
<pre><code class="lang-bash">$ docker container run --name some-postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -v db_backing:/var/lib/postgresql/data \
    -d postgres:9-alpine
</code></pre>
</li>
<li><p>Launch an interactive container attached to this new database instance, also like before:</p>
<pre><code class="lang-bash">$ docker container run -it --rm --link some-postgres:postgres \
    postgres:9-alpine psql -h postgres -U postgres
</code></pre>
</li>
<li><p>List the contents of the <code>CATICECREAM</code> table:</p>
<pre><code class="lang-bash">SELECT * FROM CATICECREAM;
</code></pre>
<p>The contents of the database have survived the deletion and recreation of the database container. As above, use <code>\q</code> to quit from the postgres prompt.</p>
</li>
</ol>
<h2 id="running-multiple-database-containers">Running Multiple Database Containers</h2>
<ol>
<li><p>Create another postgres runtime, mounting the same backing volume:</p>
<pre><code class="lang-bash">$ docker container run --name another-postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -v db_backing:/var/lib/postgresql/data \
    -d postgres:9-alpine
</code></pre>
</li>
<li><p>Create another postgres interactive prompt, pointing at this new postgres container:</p>
<pre><code class="lang-bash">$ docker container run -it --rm --link another-postgres:postgres \
    postgres:9-alpine psql -h postgres -U postgres
</code></pre>
</li>
<li><p>List the contents of the database one last time, again with <code>SELECT * FROM CATICECREAM;</code>. The database is readable exactly as before, from this new postgres container.</p>
</li>
</ol>
<h2 id="conclusion">Conclusion</h2>
<p>Whenever data needs to live longer than the lifecycle of a container, it should be pushed out to a volume outside the container&#39;s filesystem; numerous popular databases are containerized using this pattern. In addition to making sure data survives container deletion, this pattern allows us to share data among multiple containers, so multiple database instances can access the same underlying data.</p>

        </div>        
    </div>
    <div class="row">
        <ul class="mt-article-pagination" style="display:block;">
        </ul>
    </div>
</div>
    <div class="footer"></div>
</body>