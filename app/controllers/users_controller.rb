class UsersController < ApplicationController

  before_filter :signed_in_user,    only: [:index, :edit, :update, :show, 
                                           :destroy, :following, :followers]
  before_filter :correct_user,      only: [:edit, :update, :show]
  before_filter :admin_user,        only: [:destroy]

  def create
    @user = User.new(params[:user])
    @companies = Company.all
    if @user.save
      flash[:success] = "User created."
      redirect_to user_path(current_user, company_id: @user.company.id)
    else
      render 'users/new'
    end
  end

  def new
    @user = User.new
    @companies = Company.all
  end

  def show
    @user = User.find(params[:id])
    company_id = !params[:company_id].nil? ? params[:company_id] : 1
    @selected_company = company_id.to_i
    @companies = Company.all
    @company = current_user.admin? ? Company.find(company_id) : @user.company
    @since = @company.orders.any? ? @company.acquired : Date.today-7.day
    
    @trees = @company.trees
    @houses = (@trees/53).floor
    @water = @company.water
    @pools = (@water/20000).floor
    @electricity = @company.electricity
    @homes = (@electricity/12000).round(1)

    @orders = @company.orders
    @boxes = @company.boxes.order('created_at ASC')

    @count = @boxes.map { |b| b.in }.sum
    @trips = @boxes.map { |b| b.trip_count }.sum
    @inactive = @boxes.map { |b| b.out }.sum
    @active = @count - @inactive
    @avg = @trips / @count if @count > 0

    @cost = @boxes.map { |b| b.cost }.sum
    @yearly = (@cost / (Date.today - @since).to_i * 365).round

    @paper_cost = @company.orders.any? ? @boxes.map { |b| b.cb_cost }.sum : 1
    @yearly_cb = (@paper_cost / (Date.today - @since).to_i * 365).round
    
    @roi = @paper_cost - @cost
    @percent = (100 - @cost/@paper_cost * 100).round

    @purchase_array = []
    total = 0
    @company.orders.order('ordered_on ASC').each do |o|
      total += o.cost.to_f
      @purchase_array.append([(o.ordered_on.to_time.to_i.to_s+'000').to_i, total])
    end
    @purchase_array.append([(Date.today.to_time.to_i.to_s+'000').to_i, total])

    @mailings = Mailing.all

  end

  def edit
    @user = User.find(params[:id])
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "User destroyed."
    redirect_to users_url
  end

  def index
    @users = User.page(params[:page]).per(10)
  end

  def update
    if @user.update_attributes(params[:user])
      flash[:success] = "Profile updated"
      sign_in_user @user
      redirect_to @user
    else
      render 'users/edit'
    end
  end

  private
  
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_path) unless current_user?(@user)
    end

    def admin_user
      redirect_to(root_path) unless admin?
    end
end
