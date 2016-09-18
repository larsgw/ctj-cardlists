# ctj-cardlists

Repository for topics with ctj-cardlists. This repository contains topics submitted by users. 
To submit a topic, see below. To open a topic, open **any** topic (like [this one](https://larsgw.github.io/ctj-cardlists/cardlist?t=co1)), go to the sidebar and click a link under "Other datasets".

## Submitting a topic

To submit a topic, follow a few steps.

1. Copy the repository locally
2. Install the following pieces of software:
  1. [getpapers]()
  2. [norma]()
  3. [ami]()
  4. [nodejs]() and the packages: [commander](), [fs](), [xmldoc](), [progress]() and [colors]()
3. Run [data/cmine.json]() with the following arguments:
  * `-q`: Query. [Query documentation](https://github.com/ContentMine/workshop-resources/blob/master/software-tutorials/getpapers/getpapers-eupmc-queries.md)
  * `-l`: Number of articles. Something around 250-1000
  * `-c`: Project code. Three-symbol non-taken code. To see taken codes, see [data/topics.json]()
4. Now the data is present but unlisted. To list it, add an entry to [data/topics.json]() as in the examples
5. Create a pull request
6. When accepted, the link to your dataset is https://larsgw.github.io/ctj-cardlists/cardlist?t=**YOUR_CODE**

## License

For the license of the different articles mentioned in the content, see the respective articles. The underlying source code in this repository used to format and display that content is licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).