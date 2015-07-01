npm run build-examples
cd examples/build
rm -rf .git
git init .
git remote add origin git@github.com:unfold/transit.git
git checkout -b gh-pages
git add .
git commit -m "Publish docs"
git push -f origin gh-pages
rm -rf .git
cd ..
